import React, {useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import { Head, Link } from '@inertiajs/inertia-react';
import Pagination from '@/Components/Pagination';
import Swal from 'sweetalert2'
import { Inertia } from '@inertiajs/inertia';

export default function Index(props) {
	const { mocktests } = props;

	function deleteAction(id){
		const data = {id};

		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				Inertia.post(route('mock.destroy'), data).then((res) => {					
					
				});
			}
		})
	}

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<>
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mock Tests
	            	<div className="float-right">
	            		<Link className="ml-4" href={route('mock.create')}>
	                        <Button className="mr-4">Add Mock Test</Button>
	                    </Link>
	            	</div>
            	</h2>
            	</>
            }
        >
            <Head title="Mock Tests" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        
                    	<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
									<th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
									<th className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								
								{mocktests?.data.length>0 && mocktests.data.map((data, key) => {
								return(
									<tr key={key}>
										<td className="px-6 py-4 whitespace-nowrap">{data.title}</td>
										<td className="px-6 py-4 whitespace-nowrap">{data.status}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Link href={route('mock.edit', data.id)}>
												<Button className="mr-4">Edit</Button>
											</Link>

											<Link href="#" onClick={()=>deleteAction(data.id)}>
											<Button type="button" className="mr-4">Delete</Button>
											</Link>
										</td>
									</tr>
								);
								})}

							</tbody>
						</table>
					</div>
					
					<Pagination data={mocktests} />

                </div>
            </div>
        </Authenticated>
    );
}
