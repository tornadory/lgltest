<?php

//cloud setting
define('CLOUDKEY', '546d8fa09db54073b0b34adee80f9347');
define('CLOUDSECRET', '5QUyL78CDeOsr47he1rPRmk2OyPYRiL3jlLwIukMRU0o8SBWBEQEmiXOgjrAKoJl2xLwoDwG5oRRSc7W56XwAfT90aeJWz0jf6Pk0hb7w4hooTX7K6G6cW6jLRtByuFB');
define('CLOUDURL', 'http://731bf0788cf68bce9f0a24539c193c39.cn1.crs.easyar.com:8080/search');

header('Content-Type: application/javascript; charset=UTF-8');

// step 1
$image = getHttpData();
if (!$image) showMsg(1, 'did not send image');

// step 2 set image to cloud to recognize
$params = array(
	// GMT/UTC date and time
	'date' => gmdate('Y-m-d\TH:i:s.123\Z'),
	'appKey' => CLOUDKEY,
	'image' => $image,
);
$params['signature'] = getSign($params, CLOUDSECRET);

$str = httpPost(CLOUDURL, json_encode($params));
if (!$str) showMsg(2, 'network error');

// step 3: get result
$obj = json_decode($str);
if (!$obj || (isset($obj->status) && $obj->status == 500)) {
	showMsg(2, 'network error');
} else if ($obj->statusCode != 0) {
	showMsg(3, 'did not get any target');
} else {
	showMsg(0, $obj->result->target);
}

/**
 * mmm
 * @return string
 */
function getHttpData() {
	$image = getPostImage();
	if (!$image) $image = getPostFile();

	return $image;
}

/**
 * WebAR
 * @return bool|string
 */
function getPostImage() {
	$data = @file_get_contents('php://input');
	if ($data) {
		$obj = json_decode($data);
		$data = $obj->image;
	}
	return $data;
}

/**
 * wechat
 * @return string
 */
function getPostFile() {
	$data = '';
	if (isset($_FILES)) {
		foreach ($_FILES as $file) {
			if ($file['error'] == 0) {
				$data = base64_encode(@file_get_contents($file['tmp_name']));
				break;
			}
		}
	}

	return $data;
}

/**
 * signature
 * @param $params
 * @param $cloudSecret
 * @return string
 */
function getSign($params, $cloudSecret) {
	//sort via dictionary
	ksort($params);

	$tmp = array();
	foreach ($params as $key => $value) {
		$tmp[] = $key . $value;
	}
	$str = implode('', $tmp);

	return sha1($str . $cloudSecret);
}

function showMsg($code, $msg) {
	$arr = array(
		'statusCode' => $code,
		'result' => $msg,
	);
	echo json_encode($arr);
	exit;
}


function httpPost($url, $data) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	curl_setopt($ch, CURLOPT_HTTPHEADER, array(
		'Content-Type: application/json; charset=utf-8',
		'Content-Length: ' . strlen($data)));

	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$str = curl_exec($ch);
	curl_close($ch);

	return $str;
}
