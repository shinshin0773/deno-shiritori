import {serve} from "https://deno.land/std@0.138.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = randomWord();
let list = [];

console.log("Listening on http://localhost:8000");
serve(async(req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if(req.method === "GET" && pathname === "/shiritori"){
    return new Response(previousWord);
  }

  if(req.method === "POST" && pathname === "/shiritori"){
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    //ひらがなチェック
    if(!hiraganaCheck(nextWord)) {
      return new Response("ひらがなのみで入力してください", {
        status: 400
      });
    }

    //同じ文字チェック
    if(list.includes(nextWord)) {
      return new Response("一度入力した単語は使用できません",{status: 400});
    }

    //「ん」が出たらゲーム終了
    if (nextWord.charAt(nextWord.length - 1) == "ん") {
      previousWord = randomWord();
      list = [];
      return new Response(previousWord);
    }

    if(nextWord.length <= 1){
      return new Response("二文字以上入力してください。", {status: 400});
    }

    // 入力チェック
    if (
      nextWord.length > 0 &&
      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    ) {
      return new Response("前の単語に続いていません。", { status: 400 });
    }


    list.push(nextWord);
    previousWord = nextWord;
    return new Response(previousWord,list);
  }

  return serveDir(req,{
    fsRoot: "public",
    urlRoot:"",
    showDirListing: true,
    enableCors: true,
  });
});

function randomWord() {
  const wordList = [
  "きょり",
  "かいきゅう",
  "ぎゃくすう",
  "せいさんかくすい",
  "どすうぶんぷひょう",
  "ねじれのいち",
  "ちぇばのていり",
  "ふぇるまーのさいしゅうていり",
  "へくたーる",
  "ぴたごらすしき",
  "ぜったいふとうしき",
  "くらめるのこうしき",
  "ふーりえかいきゅう"
  ];
  let result = "";
  result = wordList[Math.floor(Math.random() * wordList.length)];
  console.log(result);
  return result;
}



function hiraganaCheck(str){
  str = (str==null)?"":str;
  if(str.match(/^[ぁ-んー　]*$/)){    //"ー"の後ろの文字は全角スペースです。
    return true;
  }else{
    return false;
  }
}
