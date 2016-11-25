<?php

if(isset($_POST['keyword'])) {
    $keyword = $_POST['keyword'];
    $data = queryDemoData($keyword);

    exit(json_encode(array('code' => 'N00000', 'message' => '获取成功！', 'data' => $data)));
}


exit('尝试POST请求吧！');



function queryDemoData($keyword) {
    // 可以修改成去数据库获取数据
    $data = [
    ];

    $test_data = [
        'abc' => [
            'id' => 1,
            'name' => 'abc',
        ],
        'kkkkk' => [
            'id' => 3,
            'name' => 'kkkkk',
        ],
        'akkk' => [
            'id' => 4,
            'name' => 'akkk',
        ],
        'csscc' => [
            'id' => 5,
            'name' => 'csscc',
        ],
        '2ds12' => [
            'id' => 6,
            'name' => '2ds12',
        ],
    ];

    foreach($test_data as $key => $val) {
        if(strstr($key, $keyword) || $keyword == '') {
            $data[] = $val;
        }
    }

    return $data;
}
