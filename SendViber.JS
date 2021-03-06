//const nanoid = require('nanoid')

var { nanoid } = require("nanoid");
var ID = nanoid(24);


var smpp = require('smpp');
var session = smpp.connect('smpp://smpp01.telecomsxchange.com:2776');


// Parse Billing Price TLV from TCXC Proxy
smpp.addTLV('billing_price', {
    id: 0x1520,
    type: smpp.types.tlv.string
});

// Parse Billed Message Counts (Segments) if more than one.

smpp.addTLV('billed_msgs_cnt', {
    id: 0x1521,
    type: smpp.types.tlv.string
});


// Viber TLVs on TCXC SMPP Proxy :

smpp.addTLV('viber_text', {
    id: 0x146A,
    type: smpp.types.tlv.string
});

smpp.addTLV('viber_button_cta', {
    id: 0x146D,
    type: smpp.types.tlv.string
});

smpp.addTLV('viber_button_text', {
    id: 0x146C,
    type: smpp.types.tlv.string
});

smpp.addTLV('viber_image_url', {
    id: 0x146B,
    type: smpp.types.tlv.string
});

smpp.addTLV('viber_failover_step', {
    id: 0x1480,
    type: smpp.types.tlv.string
});


// SMPP AUTHENTICATION DETAILS 

session.bind_transceiver({
	system_id: 'SMPP USER',
	password: 'SMPP PASSWORD'
}, function(pdu) {
	if (pdu.command_status == 0) {
	
  // Successfully bound
		session.submit_sm({
			destination_addr: '123456789',    // Viber User Phone Number
			source_addr: '19540000000',      // Your Phone number
			registered_delivery: 1,
			message_id: ID,
			viber_text: 'Hello World - Your code is ', // Viber text - Title 
			viber_button_cta: 'https://google.com',      // URL - Hyperlink
			viber_button_text: 'Click Here',  // Show Button
			viber_image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Tom_Hanks_2016.jpg/220px-Tom_Hanks_2016.jpg', // Media URL
			short_message: 'Hello World, Your code is'  + ID,  // Body of your message
			

		}, function(pdu) {
			if (pdu.command_status == 0) {
				// Message successfully sent
				console.log("message sent OK");
			} else {
				console.log("message sending failed");
			}
			console.log("SOMETHING HAPPENNED:",pdu);
		});

		session.on('deliver_sm', function(pdu) {
			console.log(pdu)
	    		if (pdu.esm_class == 4) {
	       			var shortMessage = pdu.short_message;
	       			console.log('Received DR: %s', shortMessage);
	       			session.send(pdu.response());
	    		}
	    	});

                session.on('pdu', function(pdu) {
                        console.log("GOT PDU ", pdu)
                });

	}
});
