import lunr from "/Users/chenhan/Desktop/Git/WSDoc/node_modules/lunr/lunr.js";
require("/Users/chenhan/Desktop/Git/WSDoc/node_modules/lunr-languages/lunr.stemmer.support.js")(lunr);
require("/Users/chenhan/Desktop/Git/WSDoc/node_modules/@easyops-cn/docusaurus-search-local/dist/client/shared/lunrLanguageZh.js").lunrLanguageZh(lunr);
require("/Users/chenhan/Desktop/Git/WSDoc/node_modules/lunr-languages/lunr.multi.js")(lunr);
export const removeDefaultStopWordFilter = ["en"];
export const language = ["zh","en"];
export const searchIndexUrl = "search-index{dir}.json?_=d540b9bb";
export const searchResultLimits = 12;
export const fuzzyMatchingDistance = 1;