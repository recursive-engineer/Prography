function main(){
    var canvas=document.getElementById('canvas');
    if(canvas.getContext){
        var ctx=canvas.getContext('2d');
        drawImage(canvas,ctx);
    }
    var color_matrix=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    color_matrix=inputs(artwork);
    color_matrix=input_update(canvas,ctx,color_matrix);
}

function drawImage(canvas,ctx){
    var img = new Image();
    img.src="./png/ukiyoe1.jpeg";
    img.onload=fitImage;
    function fitImage(){
        var h_ratio=canvas.width/this.naturalWidth;
        var v_ratio=canvas.height/this.naturalHeight;
        var ratio=Math.min(h_ratio,v_ratio);
        var centerShift_x=(canvas.width-this.naturalWidth*ratio)/2;
        var centerShift_y=(canvas.height-this.naturalHeight*ratio)/2;
        ctx.drawImage(img,centerShift_x,centerShift_y,img.naturalWidth*ratio,img.naturalHeight*ratio);
    }
}

function do_filter(canvas,ctx,matrix){
    const imageData=ctx.getImageData(0,0,canvas.clientWidth,canvas.clientHeight);
    let data = imageData.data;
    data=filter(data,matrix);
    imageData.data=data;
    ctx.putImageData(imageData,0,0);
}

function filter(data,matrix){
    for(let i=0;i<data.length;i+=4){
        var color=[data[i],data[i+1],data[i+2],1];
        color=T(color);
        color=product(matrix,color);
        color=T(color);
        data[i]=color[0];
        data[i+1]=color[1];
        data[i+2]=color[2];
        const noise=0;
        data[i]+=Math.floor((Math.random()-0.5)*noise);
        data[i+1]+=Math.floor((Math.random()-0.5)*noise);
        data[i+2]+=Math.floor((Math.random()-0.5)*noise);
    }
    alert("完了");
    return data;
}

function T(A){
    let mn=is_matrix(A);
    let tmp=zeros(mn[1],mn[0]);
    if(mn[1]==1){
        if(mn[0]==1){
            tmp=A;
        }else{
            for(i in A){
                tmp[i]=A[0][i];
            }
        }
    }else{
        if(mn[0]==1){
            for(i in A){
                tmp[i][0]=A[i];
            }
        }else{
            for(i in A){
                for(j in A[i]){
                    tmp[j][i]=A[i][j];
                }
            }
        }
    }
    return tmp;
}

function product(A,B){
    let Amn=is_matrix(A);
    let Bmn=is_matrix(B);
    if(Amn[0]!==Bmn[1]){console.log('multiplication is not defined.');}
    let tmp=zeros(Amn[0],Bmn[1]);
    if(Amn[0]==1){
        if(Bmn[1]==1){
            for(let i=0;i<Amn[1];i++){
                tmp+=A[0][i]*B[i];
            }
        }else{
            for(i in tmp){
                for(let j=0;j<Amn[1];j++){
                    tmp[i]+=A[0][j]*B[j][i];
                }
            }
        }
    }else{
        if(Bmn[1]==1){
            for(i in tmp){
                for(let j=0;j<Amn[1];j++){
                    tmp[i][0]+=A[i][j]*B[i][0];
                }
            }
        }else{
            for(i in tmp){
                for(j in tmp[i]){
                    for(let k=0;k<Amn[1];k++){
                        tmp[i][j]+=A[i][k]*B[k][j];
                    }
                }
            }
        }
    }
    return tmp;
}

function is_matrix(array) {
    let row=0;
    let col=0;
    let res=GetDimension(array);
    if(res==-1){
        console.log("array is null")
    }else if(res==0){
        row=1;
        col=1;
    }else if(res==1){
        row=1;
        col=array.length;
    }else if(res==2){
        row=array[0].length;
        col=array.length;
    }else{
        console.log("array's dimention is too much");
    }
    return [row,col];
}

function GetDimension(obj){
    res=-1;
    if(obj===null){return res;}
    res=0;
    while(Object.prototype.toString.call(obj)==='[object Array]'){
        res++;
        obj=obj[0];
    }
    return res;
}

function zeros(row,col) {
    var zeros=[];
    if(row==1){
        if(col==1){
            zeros=0;
        }else{
            for(let j=0;j<col;j++){
                zeros.push(0);
            }
        }
    }else{
        if(col==1){
            for(let i=0;i<row;i++){
                let tmp=[];
                for(let j=0;j<col;j++){
                    tmp.push(0);
                }
                zeros.push(tmp);
            }
        }else{
            for(let i=0;i<row;i++){
                let tmp=[0];
                zeros.push(tmp);
            }
        }
    }
    return zeros;
}

function inputs(artwork){
    var color_matrix=zeros(4,4);
    console.log(color_matrix);
    var inputs=document.createElement('div');
    inputs.style="width:450px;height:50px;margin:20px;";
    var matrix=document.createElement('div');
    matrix.style="width:100px;height:100px;";
    artwork.appendChild(inputs);
    inputs.appendChild(matrix);
    for(let i=1;i<5;i++){
        var col=document.createElement('div');
        col.style="width:100px;height:20px;display:flex;";
        matrix.appendChild(col);
        for(let j=1;j<5;j++){
            var elem=document.createElement('input');
            elem.style="width:80px;padding:5px;";
            elem.type="number";
            elem.className="elem";
            elem.setAttribute("row",i-1);
            elem.setAttribute("col",j-1);
            elem.min="0";
            elem.max="1";
            elem.step="0.01";
            if(i==j){elem.value=1;}else{elem.value=0;}
            color_matrix[i-1][j-1]=Number(elem.value);
            col.appendChild(elem);
        }
    }
    var buttons=document.createElement('div');
    buttons.style="width:400px;height:40px;display:flex;";
    var apply_button=document.createElement('button');
    apply_button.textContent="適用";
    apply_button.type="button";
    apply_button.className="btn";
    apply_button.style="border-color: #6610f2;color:#6610f2;";
    apply_button.id="apply_button";
    apply_button.addEventListener("mouseover",function(){
        apply_button.style="background-color: #6610f2;color:white;";
    });
    apply_button.addEventListener("mouseleave",function(){
        apply_button.style="background-color: white;border-color: #6610f2;color:#6610f2;";
    });
    var progress=document.createElement('div');
    progress.role="progressbar";
    progress.setAttribute("aria-valuenow","75");
    progress.setAttribute("aria-valuemin","0");
    progress.setAttribute("aria-valuemax","100");
    progress.className="progress-bar progress-bar-striped progress-bar-animated";
    progress.style="width:100px;";
    var init_button=document.createElement('button');
    init_button.textContent="初期化";
    init_button.type="button";
    init_button.className="btn btn-secondary";
    init_button.id="init_button";
    inputs.appendChild(buttons);
    buttons.appendChild(init_button);
    buttons.appendChild(apply_button);
    buttons.appendChild(progress);
    return color_matrix;
}

function input_update(canvas,ctx,color_matrix){
    var elem=document.getElementsByClassName('elem');
    var init_button=document.getElementById('init_button');
    var apply_button=document.getElementById('apply_button');
    for(let i=0;i<elem.length;i++){
        elem[i].addEventListener("input",function(){
            const row=this.getAttribute("row");
            const col=this.getAttribute("col");
            color_matrix[row][col]=Number(this.value);
        });
    }
    apply_button.addEventListener("click",function(){
        do_filter(canvas,ctx,color_matrix);
    });
    init_button.addEventListener("click",function(){
        drawImage(canvas,ctx);
        for(let i=0;i<elem.length;i++){
            const row=elem[i].getAttribute("row");
            const col=elem[i].getAttribute("col");
            if(row==col){
                elem[i].value=1;
            }else{
                elem[i].value=0;
            }
        }
    });
    return color_matrix;
}