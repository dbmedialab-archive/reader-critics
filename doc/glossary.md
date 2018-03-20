# Glossary

<table border="1" cellpadding="3" cellspacing="0">
	<tr>
		<th width="50%">Explanation</th>
		<th width="50%">Technical</th>
	</tr>
	<!-- Admin Frontend -->
	<tr>
		<td colspan="2"><b>Admin Frontend</b></td>
	</tr>
	<tr>
		<td valign="top">User interface on top of all the data, mostly to list <em>Articles</em> and <em>Feedbacks</em> plus a few administration tasks like <em>User</em> and <em>Website</em> management.</td>
		<td valign="top">Password/login protected, only <em>Users</em> can log into this frontend, not <em>Endusers</em>.</td>
	</tr>
	<!-- API -->
	<tr>
		<td colspan="2"><b>API</b></td>
	</tr>
	<tr>
		<td valign="top">A set of webserver routes in the backend which handles all data between the frontends and the <em>service</em> layer.</td>
		<td valign="top">Two different APIs exist: one is public and serves the <em>Enduser Frontend</em> and the other is secured by a login mechanism and session handling and serves the <em>Admin Frontend</em>.</td>
	</tr>
	<!-- Article -->
	<tr>
		<td colspan="2"><b>Article</b></td>
	</tr>
	<tr>
		<td valign="top">A published text on the customer's website, very often just in plain HTML format like a normal visitor would see it. Our system parses these articles on demand and breaks them up into meta information and <em>Article Items</em>.</td>
		<td valign="top">The <em>Article</em> object contains meta information like original URL, version (most often this is the "last modified" time) and an array of elements, which are basically the content. Also references to the <em>authors</em> and the <em>feedbacks</em> given on the article, the <em>Website</em> it belongs to and a status object, which currently holds the <em>escalation</em> state.</td>
	</tr>
	<!-- Article Item -->
	<tr>
		<td colspan="2"><b>Article Item</b></td>
	</tr>
	<tr>
		<td valign="top">A distinct part of article content, for example a headline or a paragraph.</td>
		<td valign="top">The enum <code>ArticleItemType</code> lists all known item types; the types are reduced in the <em>Feedback Items</em>.</td>
	</tr>
	<!-- Author -->
	<tr>
		<td colspan="2"><b>Author</b></td>
	</tr>
	<tr>
		<td valign="top">Person who wrote an <em>Article</em>, there could be several.</td>
		<td valign="top">All authors that have an e-mail address in their article byline will receive e-mail notifications about feedbacks and other events.</td>
	</tr>
	<!-- Editor -->
	<tr>
		<td colspan="2"><b>Editor</b></td>
	</tr>
	<tr>
		<td valign="top">A <em>User</em> role that grants access to advanced functions in the <em>Admin Frontend</em>.</td>
		<td valign="top"></td>
	</tr>
	<!-- Enduser -->
	<tr>
		<td colspan="2"><b>Enduser</b></td>
	</tr>
	<tr>
		<td valign="top">Someone who gave a <em>Feedback</em> to an <em>Article</em>. Endusers are not allowed to log into the <em>Admin Frontend</em> or any other part of the system. If they happen to give us their information (like a name and e-mail address) these will be stored, otherwise the <em>Feedback</em> will be linked to an <em>Anonymous Enduser</em>.</td>
		<td valign="top">Only consists of a `name` and `email` property, no other information is stored.</td>
	</tr>
	<!-- Enduser Frontend -->
	<tr>
		<td colspan="2"><b>Enduser Frontend</b></td>
	</tr>
	<tr>
		<td valign="top">Consists of the feedback form where <em>Endusers</em> put in their feedback to an article, the "Suggestion Box" and the generic home page.</td>
		<td valign="top">The React frontend that communicates with the public <em>API</em>.</td>
	</tr>
	<!-- Feedback -->
	<tr>
		<td colspan="2"><b>Feedback</b></td>
	</tr>
	<tr>
		<td valign="top">The complete <em>Feedback</em> that an <em>Enduser</em> gives on an <em>Article</em>, possibly consisting of comments and text suggestions for several parts of the <em>Article</em> content.</td>
		<td valign="top">Among other data, the <em>Feedback</em> contains a status value including a log of past status changes.</td>
	</tr>
	<!-- Feedback Item -->
	<tr>
		<td colspan="2"><b>Feedback Item</b></td>
	</tr>
	<tr>
		<td valign="top">These items contain what an <em>Enduser</em> has to "say" about some content in an <em>Article</em>. Since it is possible to give feedback on every single <em>Article Item</em>, the article and feedback item types are mapped 1:1 by some of their common properties which make them uniquely addressable.</td>
		<td valign="top">The <em>Feedback Item</em> extends the <em>Article Item</em> interface and adds properties for the <em>enduser</em> comment, an array of links and a possibly modified content (to suggest corrections for typos, different wording or whole new sentences even). The mapping properties are <code>type</code>, <code>order.item</code> and <code>order.type</code> which are defined in the <em>Article Item</em> interface.</td>
	</tr>
	<!-- Escalation -->
	<tr>
		<td colspan="2"><b>Escalation</b></td>
	</tr>
	<tr>
		<td valign="top">After an <emArticle></em> has received a configurable number of <em>Feedbacks</em> the <em>Escalation</em> is triggered. This means that a special type of notification is sent to the <em>Editors</em> that are configured in the <em>Website</em> options.</td>
		<td valign="top"></td>
	</tr>
	<!-- Message Queue -->
	<tr>
		<td colspan="2"><b>Message Queue</b></td>
	</tr>
	<tr>
		<td valign="top">For asynchronous tasks and load distribution, the backend uses a message queue that can be filled with jobs that should be executed in the background. A Cron issues regular tasks like polling article updates or compiling digest e-mails.</td>
		<td valign="top">The queue uses one of the configured Redis instances, which makes it possible to start several instances of the application in different locations. They will communicate over this message queue, as long as the Redis connection can be established from every location. To ensure that only one of the instances creates jobs from the Cron tasks, a master node is elected.</td>
	</tr>
	<!-- Parser -->
	<tr>
		<td colspan="2"><b>Parser</b></td>
	</tr>
	<tr>
		<td valign="top">Takes an <em>Article</em> and tries to get all necessary information out of it. Mandatory for further processing is at least the current article version and some content.</td>
		<td valign="top">Several implementations, both more general as well as specialized for specific publications exist in the backend. The parser which should be used is configured in the <em>Website</em> options.</td>
	</tr>
	<!-- Service -->
	<tr>
		<td colspan="2"><b>Service</b></td>
	</tr>
	<tr>
		<td valign="top">Services in the backend are a layer between the <em>API</em> and the persistence, so mostly the database layer.</td>
		<td valign="top">See the detailed description of the service layer.</td>
	</tr>
	<!-- User -->
	<tr>
		<td colspan="2"><b>User</b></td>
	</tr>
	<tr>
		<td valign="top">Users with different roles who are allowed to log into the <em>Admin Frontend</em> if a password is set on that user.</td>
		<td valign="top">Passwords are encrypted with <b>BCrypt</b>, the number of salting rounds is configurable.</td>
	</tr>
	<!-- Website -->
	<tr>
		<td colspan="2"><b>Website</b></td>
	</tr>
	<tr>
		<td valign="top">A <em>Website</em> object contains all configuration options for one digital publication.</td>
		<td valign="top">The most important options are the hostnames, the user parser class and the list of <em>Editors</em>.</td>
	</tr>
</table>
