import React from 'react';
import parse from 'html-react-parser';
import Button from '@/Components/Button';
import { Link } from '@inertiajs/inertia-react';

export default function Pagination({ data }) {
    return (
        <>
        {data?.length>0 &&
	        <div className="mt-4">
				<nav>
					{data.links.map((link, key) => {
					return(
						<Link href={link.url} key={key}>
							<Button className="mr-4" processing={link.active}>{link?.label ? parse(link.label) : ''}</Button>
						</Link>
					);
					})}
				</nav>
			</div>
		}
		</>
    );
}
