import React, {useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Timer from '@/Components/Timer';
import { Head, Link } from '@inertiajs/inertia-react';
import ReactDiffViewer from 'react-diff-viewer';
import stringSimilarity from 'string-similarity';

//const speech = require('@google-cloud/speech');
//const client = new speech.SpeechClient();

export default function Index(props) {
	const { mockData, auth } = props;

	let newValue = mockData?.audio_to_text;
    let oldValue = mockData?.mock?.desc;

    let rating = 0;
    if(newValue && oldValue){
        rating = stringSimilarity.compareTwoStrings(oldValue, newValue);
    }

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mock Test Results

            		<div className="float-right">
            			<audio controls>
							<source src={mockData?.audio_src} type="audio/mpeg" />
							<p>Your browser doesn't support HTML5 audio. Here is
							a <a href="myAudio.mp3">link to the audio</a> instead.</p>
						</audio>
            		</div>
            	</h2>
            }
        >
            <Head title="Mock Test Results" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">



                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">

                        <h2>{mockData?.mock?.title}</h2>
                        {auth?.user?.role=='admin' &&
                        <div>
                            <h3>Student Name: {mockData?.user?.name}</h3>
                            <h3>Student Email: {mockData?.user?.email}</h3>
                        </div>
                        }
                        
                        {rating>0 &&
                            <h3>Overall Rating: {(rating*100).toFixed()}%</h3>
                        }
                        {(mockData?.pause_count>0) &&
                            <h3>Total Pause: {mockData?.pause_count}</h3>
                        }
                        {mockData?.timer &&
                            <h3>Time: <Timer time={mockData?.timer} /> { mockData?.timer >= 60000 ? 'Minutes' : 'Seconds'}</h3>
                        }
                        <br />
                        <br />


                        {(oldValue && newValue) &&
                            <ReactDiffViewer oldValue={oldValue} newValue={newValue} splitView={true} />
                        }
					</div>
                </div>
            </div>
        </Authenticated>
    );
}
