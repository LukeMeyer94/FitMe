import { BrowserPolicy } from 'meteor/browser-policy-common';
// e.g., BrowserPolicy.content.allowOriginForAll( 's3.amazonaws.com' );

BrowserPolicy.content.allowFontOrigin('data:');
BrowserPolicy.content.allowOriginForAll('scontent.xx.fbcdn.net');
BrowserPolicy.content.allowOriginForAll('ws://localhost:3000');
BrowserPolicy.content.allowOriginForAll('https://maps.googleapis.com');
BrowserPolicy.content.allowOriginForAll('https://csi.gstatic.com');
BrowserPolicy.content.allowOriginForAll('https://cdnjs.cloudflare.com');
BrowserPolicy.content.allowOriginForAll('https://maxcdn.bootstrapcdn.com');
