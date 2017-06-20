import * as React from 'react';

const Footer : React.StatelessComponent <any> =
	() => <footer id='main-footer'>
		<div className='container'>
			<div className='content four columns'>
				<span><a href='http://dagbladet.no'><img src='http://vaktbikkja.medialaben.no/assets/img/db-logo.png' alt='Dagbladet.no' /></a></span>
			</div>
			<div className='content four columns'>
				<span>Ris eller ros?</span>
				<a href='/gitilbakemelding'>Gi oss din tilbakemelding på verktøyet</a>
			</div>
			<div className='content four columns'>
				<span>Ansvarlig redaktør <a href='/cdn-cgi/l/email-protection#d6bcb9beb8f8b7a4b8b3f8bbb7a4bda3a5a5b3b896b2b7b1b4bab7b2b3a2f8b8b9'>John Arne Markussen</a>
				</span>
				<div itemType='http://schema.org/Organization'>© 2016 <span itemProp='name'>DB Medialab</span></div>
			</div>
		</div>
	</footer>;

export default Footer;
