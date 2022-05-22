import React, {useState, useEffect} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import Label from '@/Components/Label';
import ValidationErrors from '@/Components/ValidationErrors';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function Form(props) {

	const { mocktest } = props;
	const [title, setTitle] = useState('Add New Mock Test');
	
	
	const { data, setData, post, processing, errors, reset } = useForm({
        id: mocktest?.id ?? '',
        title: mocktest?.title ?? '',
        description: mocktest?.description ?? '',
        status: mocktest?.status ?? '',
    });


	useEffect(() => {
		
		if(mocktest?.id){
            
			setTitle('Edit Mock Test');
		}

    }, [mocktest]);


    const onHandleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('mock.store'));
    };

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<>
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">{title}
	            	<div className="float-right">
	            		<Link className="ml-4" href={route('mock.index')}>
	                        <Button className="mr-4">Back Mock Test</Button>
	                    </Link>
	            	</div>
            	</h2>
            	</>
            }
        >
            <Head title={title} />


            <div className="min-h-screen flex flex-col items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full max-w-xl mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    
		            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

		            <ValidationErrors errors={errors} />

		            <form onSubmit={submit}>
		                <div>
		                    <Label forInput="title" value="Title" />

		                    <Input
		                        type="text"
		                        name="title"
		                        value={data.title}
		                        className="mt-1 block w-full"
		                        isFocused={true}
		                        handleChange={onHandleChange}
		                    />
		                </div>

		                <div className="mt-4">
		                    <Label forInput="description" value="Description" />
		                    <CKEditor
		                    	editor={ ClassicEditor }
		                    	data={data.description}
		                    	onChange={ ( event, editor ) => {
			                        const data = editor.getData();
			                        //console.log( { event, editor, data } );
			                    	setData('description', data);
			                    }}
		                    	/>
		                </div>

		                <div className="mt-4">
		                    <Label forInput="status" value="Status" />

		                    <div className="flex">
		                    <Input
		                        type="radio"
		                        name="status"
		                        value="active"
		                        checked={data.status==='active' ? true : false}
		                        handleChange={onHandleChange}
		                    /> <span className="ml-2 text-sm text-gray-600">Active</span>

		                    <Input
		                        type="radio"
		                        name="status"
		                        value="deactive"
		                        className="ml-2"
		                        checked={data.status==='deactive' ? true : false}
		                        handleChange={onHandleChange}
		                    /> <span className="ml-2 text-sm text-gray-600">Deactive</span>
		                    </div>
		                </div>

		                <div className="flex items-center justify-end mt-4">                 

		                    <Button className="ml-4" processing={processing}>
		                        Save
		                    </Button>
		                </div>
		            </form>
			    </div>
			</div>

        </Authenticated>
    );
}
