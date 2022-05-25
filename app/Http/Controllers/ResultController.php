<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Storage;

use App\Models\MockResults;
use App\Jobs\SpeechToText;

class ResultController extends Controller
{


    //
	public function index(Request $request){
		//...
		$job  = dispatch( new SpeechToText())->onQueue('SpeechToText');
		


		$mockresults = MockResults::with(['mock', 'user']);
			
		if(auth()->user()->role=='user'){
			$mockresults = $mockresults->whereUsersId(auth()->user()->id);
		}
		
		$mockresults = $mockresults->orderBy('id', 'desc')->paginate(10);

		return Inertia::render('Result/Index', ['mockresults'=>$mockresults]);
	}


	//
	public function show(Request $request){

		$mockresults = MockResults::where('id', $request->mock)->with(['mock', 'user'])->first();

		if(!$mockresults){
			abort(404);
		}
		//...
		if(auth()->user()->role=='user' && $mockresults->users_id !== auth()->user()->id){
			abort(404);
		}

		//dd($mock);
		return Inertia::render('Result/Show', ['mockData'=>$mockresults]);
	}



}
