let socket = io.connect();


function addTransaction(event) {
	let $hashfield = $('#addtransaction-form input[name="hash"]');
	if($hashfield.val()) {
		$.post('/transaction/add', $('#addtransaction-form').serialize(), (json) => {
			showMessage(json, event);
			if (json.status == 'success'){
				socket.emit('get-transactions', $('#lottery-id').val());
			} else{
				$hashfield.val('')
			}
		})
	}
	return false;
}


socket.on('send-transactions', function (json) {
	if(json.closed) location.reload();
	if(json.id !== $('#lottery-id').val()) return;

	let $container = $('#transactions-rows');
	$('#prize-sum').text(json.prize.toFixed(4));
	$('#remainder-sum').text(json.remainder.toFixed(4));
	$container.text('');
	json.transactions.forEach((tx)=>{
		let reflink = window.location.protocol + '//' + window.location.hostname + '/referal/' + tx._id;
		let $row = $('<tr>')

		$row.append($('<td>').addClass('text-center').text(tx.value.toFixed(4)));
		$row.append($('<td>').addClass('text-center').text(Math.ceil(tx.points)));
		$row.append($('<td>').append($('<span>').addClass('click-to-copy').text(reflink)));
		$row.append($('<td>').addClass('mobile-hide').append($('<a>').attr({target:'_blank',href:json.ethexplorer+'/tx/'+tx.hash}).text(tx.hash)));
		$row.append($('<td>').addClass('mobile-hide').text(tx.date));
		$container.append($row);
	})
	$('.click-to-copy').click(function (e) {selectandcopy(this,e)});
});



$(function () {
	$('#share-link').text(window.location.href );
	$('#addtransaction-submit').click(function (e) { addTransaction(e)});
	$('.click-to-copy').click(function (e) {selectandcopy(this,e)});
	socket.emit('get-transactions', $('#lottery-id').val());
})

function selectandcopy(obj,event) {
	if (document.selection) {
		let range = document.body.createTextRange();
		range.moveToElementText(obj);
		range.select();
	} else if (window.getSelection) {
		let range = document.createRange();
		range.selectNode(obj);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
	}
	document.execCommand("Copy");
	showMessage({status:'success',message:'📋'},event)
}