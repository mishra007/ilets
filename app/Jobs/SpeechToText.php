<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use App\Models\MockResults;

use Google\Cloud\Speech\V1\SpeechClient;
use Google\Cloud\Speech\V1\RecognitionAudio;
use Google\Cloud\Speech\V1\RecognitionConfig;
use Google\Cloud\Speech\V1\RecognitionConfig\AudioEncoding;

class SpeechToText implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //
        $mockResults = MockResults::where('audio_gcs', '!=', null)->whereStatus('pending')->get();

        foreach($mockResults as $result){
            $this->toText($result);
        }
    }


    public function toText($mockResult){

        /** Uncomment and populate these variables in your code */
        //$audioFile = asset('uploads/audio/'.$mockResult->audio_gcs);

        // change these variables if necessary
        $encoding = AudioEncoding::WEBM_OPUS;
        $sampleRateHertz = 48000;
        $languageCode = 'en-US';

        // get contents of a file into a string
        //$content = file_get_contents($audioFile);

        // set string as audio content
        $audio = (new RecognitionAudio())
            //->setContent($content);
            ->setUri($mockResult->audio_gcs);

        // set config
        $config = (new RecognitionConfig())
            ->setEncoding($encoding)
            ->setSampleRateHertz($sampleRateHertz)
            ->setLanguageCode($languageCode);

        // create the speech client
        //$client = new SpeechClient();
        $client = new SpeechClient([
            'credentials' => config('services.google.credentials'),
        ]);

        // create the asyncronous recognize operation
        $operation = $client->longRunningRecognize($config, $audio);
        $operation->pollUntilComplete();

        

        if ($operation->operationSucceeded()) {
            $response = $operation->getResult();
            // each result is for a consecutive portion of the audio. iterate
            // through them to get the transcripts for the entire audio file.
            
            $allText = '';

            foreach ($response->getResults() as $result) {
                $alternatives = $result->getAlternatives();
                $mostLikely = $alternatives[0];
                $transcript = $mostLikely->getTranscript();
                $confidence = $mostLikely->getConfidence();

                //...
                $allText = $allText . $transcript;
                //printf('Transcript: %s' . PHP_EOL, $transcript);
                //printf('Confidence: %s' . PHP_EOL, $confidence);
            }

            //...
            $mockResult->status = 'progress';
            $mockResult->audio_to_text = $allText;
            $mockResult->save();

        } else {
            print_r($operation->getError());
        }

        $client->close();

    }

}
