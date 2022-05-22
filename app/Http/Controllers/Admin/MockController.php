<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

use App\Models\MockTest;
use Str;

class MockController extends Controller
{
    //
	public function index(Request $request){
		//...
		$mocktests = MockTest::orderBy('id', 'desc')->paginate(10);


		return Inertia::render('Admin/Mock/Index', ['mocktests'=>$mocktests]);
	}

	//
	public function create(){
		
		return Inertia::render('Admin/Mock/Form', ['mocktest'=>'']);
	}

	//
	public function store(Request $request)
	{
		if(@$request->id){
	        $request->validate([
	            'title' => 'required|max:100|unique:mock_tests,title,'.$request->id.'|unique:mock_tests,slug,'.$request->id,
	            'description' => 'required',
	            'status' => 'required',
	        ]);
	    }
	    else {
	    	$request->validate([
	            'title' => 'required|max:200|unique:mock_tests,title|unique:mock_tests,slug',
	            'description' => 'required',
	            'status' => 'required',
	        ]);
	    }


		$message = 'Mock Test Created';
		
		$store = new MockTest;

		if(@$request->id){
			$message = 'Mock Test Updted';
			$check = MockTest::find($request->id);
			if($check){
				$store->id = $check->id;
				$store->exists = true;
			}
		}

        $store->title = $request->title;
        $store->slug = Str::slug($request->title, '-');
        $store->description = $request->description;
		$store->status = $request->status;
		$store->save();

		

		return Redirect::route('mock.index')->with('success', $message);

	}

	//
	public function edit(Request $request, MockTest $mock){

		return Inertia::render('Admin/Mock/Form', ['mocktest'=>$mock]);
	}




	//
	public function destroy(Request $request){

		$mock = MockTest::findOrFail($request->id);
		
		$mock->delete();

		return Redirect::route('mock.index')->with('success', "Mock Test has been deleted.");
	}
}
