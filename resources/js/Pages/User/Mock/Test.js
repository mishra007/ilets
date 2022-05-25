import React, { useState, useCallback } from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Timer from '@/Components/Timer';
import { Head, Link } from '@inertiajs/inertia-react';
import parse from 'html-react-parser';
import { Inertia } from '@inertiajs/inertia';
import { useReactMediaRecorder } from "react-media-recorder";
import Swal from 'sweetalert2'

export default function Index(props) {
	const { mocktest } = props;

	const [pauseCount, setPauseCount] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(true);
	const [timer, setTimer] = useState(0);
	const [modalShow, setModalShow] = useState(false);


	React.useEffect(() => {
		let interval = null;

		if (isTimerActive && isTimerPaused === false) {
			interval = setInterval(() => {
				setTimer((timer) => timer + 10);
			}, 10);
		} else {
			clearInterval(interval);
		}

		return () => {
			clearInterval(interval);
		};
	}, [isTimerActive, isTimerPaused]);


	const { status, startRecording, pauseRecording, resumeRecording, stopRecording, mediaBlobUrl, error, clearBlobUrl } =
    useReactMediaRecorder({ 
    	video: false,
    	audio: true,
		type: "audio/mpeg",
		/*onStop: (blobUrl, blob) => {
			setIsTimerPaused(true);

			const audiofile = new File([blob], "audiofile.mpeg", { type: "audio/mpeg" })

			const formData = new FormData();
			formData.append("mock_audio", audiofile);
			formData.append("mock_id", mocktest.id);
			formData.append("timer", timer);
			formData.append("pause_count", pauseCount);

			console.log(timer)
			console.log(formData)
			//Inertia.post(route('mock.test.submit'), formData).then((res) => {					
					
			//});
		}*/

    });

    function startRec(){
    	setIsTimerActive(true);
    	setIsTimerPaused(false);
    	startRecording();
    }

    function pauseRec(){
    	setPauseCount(pauseCount+1);
    	pauseRecording();
    }

    function resumeRec(){
    	resumeRecording();
    }

    function stopRec(){
    	setIsTimerPaused(true);
    	stopRecording();
    	//setModalShow(true);
    	swalAction();
    }


    function swalAction(){

		Swal.fire({
			title: 'Are you sure?',
			text: "Send your test to get Result!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, send it!'
		}).then((result) => {
			if (result.isConfirmed) {
				

				const audiofile = new File([mediaBlobUrl], "audiofile.mpeg", { type: "audio/mpeg" })

				const formData = new FormData();
				formData.append("mock_audio", audiofile);
				formData.append("mock_id", mocktest.id);
				formData.append("timer", timer);
				formData.append("pause_count", pauseCount);

				//console.log(audiofile)
				Inertia.post(route('mock.test.submit'), formData).then((res) => {					
					
				})
			}
		})
	}


    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">{mocktest.title}
					<div className="float-right">					

						{(status==='recording' || status==='paused') &&
						<>
							<span className="font-semibold text-xl text-gray-800 leading-tight mr-2">
								<i className={`fa fa-microphone${status==='paused'?'-slash':''}`} aria-hidden="true"></i> {status}
							</span>
						</>
						}

						{status==='idle' &&
							<Button onClick={()=>startRec()} className="mr-2">Begin Assessment</Button>
						}

						{status==='paused' &&
							<Button onClick={()=>resumeRec()} className="mr-2">Resume</Button>
						}

						{status==='recording' &&
						<>
							<Button onClick={()=>pauseRec()} className="mr-2">Pause</Button>
							<Button onClick={()=>stopRec()} className="mr-2">Finish</Button>
						</>
						}
					</div>
				</h2>
            }
        >
            <Head title={mocktest.title} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                	{(status==='recording' || status==='paused') &&
                		<span className="font-semibold text-xl text-gray-800 leading-tight mr-2">
							<Timer time={timer} />
						</span>
					}

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
