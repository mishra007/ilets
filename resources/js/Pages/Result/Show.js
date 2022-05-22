import React, {useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import { Head, Link } from '@inertiajs/inertia-react';

//const speech = require('@google-cloud/speech');
//const client = new speech.SpeechClient();

export default function Index(props) {
	const { mockData } = props;

	

	//console.log(client)


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

                    	{mockData?.audio_to_text}

					</div>
                </div>
            </div>
        </Authenticated>
    );
}
