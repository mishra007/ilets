import React, {useState} from 'react';
import Authenticated from '@/Layouts/Authenticated';
import Button from '@/Components/Button';
import Pagination from '@/Components/Pagination';
import { Head, Link } from '@inertiajs/inertia-react';

export default function Index(props) {
	const { mockresults } = props;

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
            	<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mock Test Results</h2>
            }
        >
            <Head title="Mock Test Results" />

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
								
								{mockresults?.data.length>0 && mockresults.data.map((data, key) => {
								return(
									<tr key={key}>
										<td className="px-6 py-4 whitespace-nowrap">{data?.mock?.title}</td>
										<td className="px-6 py-4 whitespace-nowrap">{data?.status_name}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<Link href={route('result.show', [data.id, data?.mock?.slug])}>
												<Button className="mr-4">View Details</Button>
											</Link>
										</td>
									</tr>
								);
								})}

							</tbody>
						</table>
					</div>
					
					<Pagination data={mockresults} />

                </div>
            </div>
        </Authenticated>
    );
}
