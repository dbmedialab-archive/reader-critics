import * as React from 'react';

const Footer : React.StatelessComponent <any> =
	() => <footer id="main-footer">
		<div className="container">
			<div className="content four columns">
				<span>Ris eller ros?</span>
				<a title="Gi oss din tilbakemelding på verktøyet" href="/suggestion-box">
					Gi oss din tilbakemelding på verktøyet
				</a>
			</div>
			<div className="content four columns">
				<span>Ansvarlig redaktør <a href="#">John Arne Markussen</a></span>
				<div itemType="http://schema.org/Organization">
					© 2017 <span itemProp="name">DB Medialab</span>
				</div>
			</div>
		</div>
	</footer>;

export default Footer;
