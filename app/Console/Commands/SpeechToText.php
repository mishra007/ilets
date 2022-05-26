<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;


use App\Models\MockResults;

use Google\Cloud\Speech\V1\SpeechClient;
use Google\Cloud\Speech\V1\RecognitionAudio;
use Google\Cloud\Speech\V1\RecognitionConfig;
use Google\Cloud\Speech\V1\RecognitionConfig\AudioEncoding;

class SpeechToText extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'to:text';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Speech to text';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        //...
        $mockResults = MockResults::where('audio_gcs', '!=', null)->whereStatus('pending')->get();

        foreach($mockResults as $result){
            $this->toText($result);
        }
		
		
		return 'done';
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
                $allText .= $transcript;
                //printf('Transcript: %s' . PHP_EOL, $transcript);
                //printf('Confidence: %s' . PHP_EOL, $confidence);
            }
            //...
            if($allText){
                $mockResult->status = 'completed';
                $mockResult->audio_to_text = $allText;
                $mockResult->save();
            }

        } else {
            print_r($operation->getError());
        }

        $client->close();

    }
}
