<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

use App\Models\User;

class StudentsController extends Controller
{
    //
	public function index(Request $request){
		//...
		$students = User::whereRole('user')->paginate(10);


		return Inertia::render('Admin/Students/Index', ['students'=>$students]);
	}


	//
	public function destroy(Request $request){

		$student = User::findOrFail($request->id);
		
		$student->delete();

		return Redirect::route('students.index')->with('success', "Student has been deleted.");
	}

}
