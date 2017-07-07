import * as React from 'react';

import SuggestionFormContainer from 'front/suggest/SuggestionFormContainer';

const SuggestionContainer : React.StatelessComponent <any> =
	() => <div>
		<div className="confirmation">
			<div className="container">
				<div className="row section frontpage">
					<div className="content u-full-width">
						<SuggestionFormContainer />
					</div>
				</div>
			</div>
		</div>
	</div>;

export default SuggestionContainer;
