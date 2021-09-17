'use strict';
const fs = require('fs'); //ファイル読み込む、書き出す
const readline = require('readline'); //一行ずつ
const rs = fs.createReadStream('./popu-pref.csv');
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
const rl = readline.createInterface({ input: rs, output: {} });
rl.on('line', lineString => {
  const columns = lineString.split(','); //split カンマで区切られた文字列を配列に
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    // 一気に読み込めないから、一旦扱いやすいようにMapに入れてる
    if (!value) { //もしvalueがなかったら新しいオブジェクトを。↓空のデータ
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => { //最後まで読み終わったら、閉じる
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
        // const [変数名1, 変数名2] のように変数と一緒に配列を宣言することで、第一要素の key という変数にキーを、第二要素の value という変数に値を代入できます。
      }

    //Array.fromで配列(順番が得意)に変換、arrayの機能？sortで並びかえ。↓変数が二つの理由：連想配列→普通の配列：二つのキー？？
      const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change; //降順、昇順 pair1,2の順番を試してみる
      });

      //文字列にしてきれいに
      const rankingStrings = rankingArray.map(([key, value]) => {
        return (
          key +
          ': ' +
          value.popu10 +
          '=>' +
          value.popu15 +
          ' 変化率:' +
          value.change
        );
      });
      console.log(rankingStrings);
  });