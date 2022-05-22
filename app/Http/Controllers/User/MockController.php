<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

use App\Models\MockTest;
use App\Models\MockResults;

use Google\Cloud\Storage\StorageClient;

class MockController extends Controller
{
    //
	public function index(Request $request){
		//...
		$mocktests = MockTest::whereStatus('active')->orderBy('id', 'desc')->paginate(10);


		return Inertia::render('User/Mock/Index', ['mocktests'=>$mocktests]);
	}

	//
	public function takeTest(Request $request){
		//...
		$mock = MockTest::whereSlug($request->mock)->first();

		if(!$mock){
			return abort(404);
		}


		return Inertia::render('User/Mock/Test', ['mocktest'=>$mock]);
	}

	//
	public function testSubmit(Request $request){

		$request->validate([
            'mock_audio' => 'required',
            'mock_id' => 'required',
        ]);


		$store = new MockResults();

		if($request->hasFile('mock_audio')) {			

			$path = 'uploads/audio/';
			if(!is_dir($path)) {
				mkdir($path, 0775, true);
				chown($path, exec('whoami'));
			}

			$music_file = $request->file('mock_audio');
			$filename = auth()->user()->id . '-' . uniqid(time()) . '.' . $music_file->getClientOriginalExtension();

			$request->file('mock_audio')->move($path, $filename);


			//....
			$source = $path . $filename;
			$gcs = $this->upload_object($filename, $source);

			//
			$store->audio = $filename;
			$store->audio_gcs = $gcs;
		}

		//...
		$store->users_id = auth()->user()->id;
		$store->mock_tests_id = $request->mock_id;
		$store->save();


		return Redirect::route('user.mock.index')->with('success', 'Test Completed');
	}


	public function upload_object($objectName, $source)
	{
		$bucketName = config('services.google.bucket');

		$storage = new StorageClient();
		$file = fopen($source, 'r');
		$bucket = $storage->bucket($bucketName);
		$object = $bucket->upload($file, [
			'name' => $objectName
		]);

		$file = 'gs://'. $bucketName .'/'. $objectName;

		return $file;
	}


}
