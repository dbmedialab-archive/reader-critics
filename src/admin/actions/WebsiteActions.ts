//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import Website from 'base/Website';
import MainStore from 'admin/stores/MainStore';
import Api from 'admin/services/Api';
import * as WebsiteActions from './WebsiteActions';
import * as WebsiteActionsCreator from 'admin/actions/WebsiteActionsCreator';
import * as UIActions from 'admin/actions/UIActions';

export function setWebsiteList(websites: Array<Website>) {
	UIActions.hideMainPreloader();
	MainStore.dispatch(
		WebsiteActionsCreator.setWebsiteList(websites)
	);
}

export function getWebsiteList() {
	UIActions.showMainPreloader();
	Api.getWebsiteList()
		.then((resp)=>{
			WebsiteActions.setWebsiteList(resp.websites);
			WebsiteActions.setWebsiteOptions(resp.options);
		});
}

export function setSelectedWebsite(website: Website) {
	UIActions.hideMainPreloader();
	MainStore.dispatch(
		WebsiteActionsCreator.setSelectedWebsite(website)
	);
}

export function setWebsiteOptions(options: any) {
	UIActions.hideMainPreloader();
	MainStore.dispatch(
		WebsiteActionsCreator.setWebsiteOptions(options)
	);
}

export function updateWebsite(data: any) {
	UIActions.showMainPreloader();
	Api.updateWebsite(data)
		.then(resp => {
			WebsiteActions.setSelectedWebsite(resp);
			WebsiteActions.getWebsiteList();
		});
}

export function createWebsite(data: any) {
	UIActions.showMainPreloader();
	const toSend = data.asMutable();
	if (!('hosts' in toSend)) {
		toSend.hosts = [];
	}
	if (!('chiefEditors' in toSend)) {
		toSend.chiefEditors = [];
	}
	Api.createWebsite(toSend)
		.then(resp => {
			WebsiteActions.setSelectedWebsite(resp);
			WebsiteActions.getWebsiteList();
		});
}

// Used for update data while new website creation
export function updateNewWebsiteTemplate(data: any) {
	MainStore.dispatch(
		WebsiteActionsCreator.updateSelectedWebsite(data)
	);
}
