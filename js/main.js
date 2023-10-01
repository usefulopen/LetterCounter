function TextInChanged() {
    let tx_area = document.getElementById("tx_area");
    let counts_lettercode = document.getElementById("counts_lettercode");
    const txt = tx_area.value;
    const txtLength = tx_area.value.length;
    counts_lettercode.value = txtLength;

    let st_row = document.getElementById("st_row"), st_col = document.getElementById("st_col");
    const row = Number(st_row.value), col = Number(st_col.value);

    let textout = document.getElementById("textout");
    const st_char_foot = document.getElementById("st_char_foot"), st_char_head = document.getElementById("st_char_head");
    const char_foot = st_char_foot.value, char_head = st_char_head.value;
    textout.innerHTML = "";
    NewPaper(0, row, col);

    const st_head_space=document.getElementById("st_head_space").checked;

    let currentpage = 0, currentrow = 0, currentcol = st_head_space?1:0;
    // 改行直後か
    let newline_soon=false;

    let count_withspace=0, count_withoutspace=0, count_linereturn=0;
    for (let i = 0; i < txtLength; i++) {
        let currentchar = txt.charAt(i);
        // 改行文字を検知したら段落として改行
        if (currentchar == "\n") {
            count_linereturn++;
            if(!newline_soon){
                currentrow++;
                currentcol = currentcol = st_head_space?1:0;
                if (currentrow >= row) {
                    NewPaper(++currentpage, row, col);
                    currentrow = 0;
                }
            }
            
            
        }
        else {
            // 行末禁則処理
            if (currentcol >= col - 1) {
                if (ContainInList(currentchar, char_foot)) {
                    currentrow++;
                    currentcol = 0;
                    if (currentrow >= row) {
                        NewPaper(++currentpage, row, col);
                        currentrow = 0;
                    }
                }
            }
            // 行頭禁則処理
            else if (currentcol == 0) {
                if (ContainInList(currentchar, char_head)) {
                    currentrow--;
                    currentcol = col;
                    if (currentrow < 0) {
                        currentrow = row - 1;
                        currentpage--;
                    }
                }
            }
            // 原稿用紙に1文字出力
            let td = document.getElementById("d_" + currentpage + "_" + currentrow + "_" + currentcol);
            td.innerText = currentchar;
            
            if(currentchar.trim()==0){
                if(currentchar==" "||currentchar=="/u{3000}"){
                    count_withspace++;
                }
            }else{
                count_withspace++;
                count_withoutspace++;
            }

            // 現在地調整
            currentcol++;
            if (currentcol >= col) {
                currentrow++;
                currentcol = 0;
                if (currentrow >= row) {
                    NewPaper(++currentpage, row, col);
                    currentrow = 0;
                }
                newline_soon=true;
            }else{
                newline_soon=false;
            }
        }


    }
    
    document.getElementById("counts_withspace").value=count_withspace;
    document.getElementById("counts_withoutspace").value=count_withoutspace;
    document.getElementById("counts_linereturn").value=count_linereturn;
}
// charの文字がlistに含まれるならば1, どれでもなければ0を返す.
function ContainInList(char, list) {
    for (let i = 0; i < list.length; i++) {
        if (char == list.charAt(i)) {
            return 1;
        }
    }
    return 0;
}

function NewPaper(page, row, col) {
    let newsection = document.createElement('section');
    newsection.id = "s_" + page;
    newsection.classList.add("papercontainer");
    let textout = document.getElementById("textout");
    textout.append(newsection);
    let s = "<table id=\"t_"+page+"\" class=\"paper\">";
    for (let i = 0; i < row; i++) {
        s += "<tr id=\"r_" + page + "_" + i + "\">";
        for (let j = 0; j < col + 1; j++) {
            s += "<td id=\"d_" + page + "_" + i + "_" + j + "\"></td>";
        }
        s += "</td>";
    }
    s+="</table>";
    newsection.innerHTML = s;
}

function TextOut() {

}
//charAt