import React, { useState, useCallback } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import { Head, Link } from '@inertiajs/inertia-react';
import parse from 'html-react-parser';
import { Inertia } from '@inertiajs/inertia';
import { useReactMediaRecorder } from "react-media-recorder";

export default function Index(props) {
	const { mocktest } = props;

	const { status, startRecording, stopRecording, mediaBlobUrl, error, clearBlobUrl } =
    useReactMediaRecorder({ 
    	video: false,
    	audio: true,
		type: "audio/mpeg",
		onStop: (blobUrl, blob) => {

			const audiofile = new File([blob], "audiofile.mpeg", { type: "audio/mpeg" })

			const formData = new FormData();
			formData.append("mock_audio", audiofile);
			formData.append("mock_id", mocktest.id);

			Inertia.post(route('mock.test.submit'), formData).then((res) => {					
					
			});
		}

    });

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">{mocktest.title}
					<div className="float-right">
						
						<Button type="button" className="mr-2">{status}</Button>

						{status==='idle' &&
						<Button onClick={startRecording} className="mr-2">Start Test</Button>
						}

						{status==='recording' &&
						<>							
							<Button onClick={stopRecording}>Finish</Button>
						</>
						}
					</div>
				</h2>
            }
        >
            <Head title={mocktest.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                    	
                    	{mocktest?.description &&
                    		parse(mocktest.description)
                    	}

					</div>
                </div>
            </div>
        </Authenticated>
    );
}
