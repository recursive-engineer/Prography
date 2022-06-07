function main(){
    var old_image=document.getElementById('old_image');
    var new_image=document.getElementById('new_image');
    if(old_image.getContext){
        var old_ctx=old_image.getContext('2d');
        drawImage(old_image,old_ctx);
    }
    if(new_image.getContext){
        var new_ctx=new_image.getContext('2d');
        drawImage(new_image,new_ctx);
    }
    var matrix=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    var matrix_val=[1,1,1,0,0,0,0,0,0,1,1,1];
    matrix=inputs();
    [matrix,matrix_val]=input_update(new_image,new_ctx,matrix,matrix_val);
}

function drawImage(canvas,ctx){
    const img = new Image();
    img.src="./png/ukiyoe1.jpeg";
    img.onload=fitImage;
    function fitImage(){
        var v_ratio=canvas.width/this.naturalWidth;
        var h_ratio=canvas.height/this.naturalHeight;
        var ratio=Math.min(h_ratio,v_ratio);
        var centerShift_x=(canvas.width-this.naturalWidth*ratio)/2;
        var centerShift_y=(canvas.height-this.naturalHeight*ratio)/2;
        ctx.drawImage(img,0,0,this.naturalWidth,this.naturalHeight,centerShift_x,centerShift_y,this.naturalWidth*ratio,this.naturalHeight*ratio);
    }
}

function do_filter(canvas,ctx,matrix){
    const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    let data = imageData.data;
    //let data=[1,2,3,4];
    //console.log(matrix);
    filter(data,matrix).then(function (data){
        //console.log(data);
        ctx.putImageData(imageData,0,0);
    });
}

async function filter(data,matrix){
    var progress=document.getElementById("progress");
    var prog=0;
    for(let i=0;i<data.length;i+=4){
        var color=[data[i],data[i+1],data[i+2],1];
        var copy=color.concat();
        color=T(color);
        color=product(matrix,color);
        color=T(color);
        color=round_color(color);
        data[i]=color[0];
        data[i+1]=color[1];
        data[i+2]=color[2];
        //console.log(data);
        if((i/data.length)*100>prog){
            prog++;
            progress.value=prog;
            await update_prog();
        }
    }
    //alert("完了");
    return await data;
}

function round_color(color){
    for(let i=0;i<color.length;i++){
        if(color[i]<0){
            color[i]=0;
        }else if(color[i]>255){
            color[i]=255;
        }
    }
    return color;
}

function update_prog(){
    var progress=document.getElementById("progress");
    return new Promise(resolve=>{
        if(progress.value<100){
            setTimeout(()=>{
                progress.style="width:"+(progress.value)+"%";
                resolve();
            },5);
        }else{
            setTimeout(()=>{
                progress.style="display:none;";
                resolve();
            },1000);
        }
    });
}

function inputs(){
    var inputs=document.getElementById('inputs');
    var matrix=document.getElementById('matrix');
    var color_matrix=zeros(4,4);
    for(let i=1;i<5;i++){
        var col=document.createElement('div');
        col.style="width:80px;height:15px;display:flex;";
        matrix.appendChild(col);
        for(let j=1;j<5;j++){
            var elem=document.createElement('p');
            elem.style="width:30px;padding:5px;font-size:12px;text-align:center;";
            elem.className="elem";
            elem.setAttribute("row",i-1);
            elem.setAttribute("col",j-1);
            if(i==j){elem.textContent=1;}else{elem.textContent=0;}
            col.appendChild(elem);
        }
    }
    var apply=document.getElementById('apply');
    apply.addEventListener("mouseover",function(){
        apply.style="background-color: #6610f2;color:white;";
    });
    apply.addEventListener("mouseleave",function(){
        apply.style="background-color: white;border-color: #6610f2;color:#6610f2;";
    });
    return color_matrix;
}

function input_update(canvas,ctx,matrix,matrix_val){
    var elem=document.getElementsByClassName('elem');
    var param=document.getElementsByClassName('param');
    var init=document.getElementById('init');
    var apply=document.getElementById('apply');
    var progress=document.getElementById('progress');
    for(let i=0;i<param.length;i++){
        var input=param[i].getElementsByTagName("input");
        input[0].addEventListener("input",function(){
            var parag=param[i].getElementsByClassName("param_value");
            matrix_val[i]=Number(this.value);
            parag[0].textContent=Number(this.value);
            //console.log("before_calc");
            console.log(matrix_val);
            matrix=calc_matrix(matrix_val);
            //console.log("after_calc");
            //console.log(matrix);
            var matrix_view=round1(matrix);
            for(let j=0;j<elem.length;j++){
                var row=elem[j].getAttribute("row");
                var col=elem[j].getAttribute("col");
                elem[j].textContent=matrix_view[row][col];
            }
        });
    }
    apply.addEventListener("click",function(){
        //console.log(color_matrix);
        drawImage(canvas,ctx);
        do_filter(canvas,ctx,matrix);
    });
    
    init.addEventListener("click",function(){
        drawImage(canvas,ctx);
        for(let i=0;i<param.length;i++){
            var input=param[i].getElementsByTagName("input");
            var parag=param[i].getElementsByClassName("param_value");
            var row=elem[i].getAttribute("row");
            var col=elem[i].getAttribute("col");
            if(i<3){
                input[0].value=1;
                parag[0].textContent=1;
            }else if(i<9){
                input[0].value=0;
                parag[0].textContent=0;
            }else{
                input[0].value=1;
                parag[0].textContent=1;
            }
            if(row==col){
                elem[i].textContent=1;
            }else{
                elem[i].textContent=0;
            }
            matrix_val[i]=Number(input[0].value);
        }
        matrix=calc_matrix(matrix_val);
        console.log(matrix);
        do_filter(canvas,ctx,matrix);
    });
    return [matrix,matrix_val];
}

function calc_matrix(matrix_val){
    var scale_r=matrix_val[0];
    var scale_g=matrix_val[1];
    var scale_b=matrix_val[2];
    var para_r=matrix_val[3];
    var para_g=matrix_val[4];
    var para_b=matrix_val[5];
    var rot_r=Math.PI*matrix_val[6]/180;
    var rot_g=Math.PI*matrix_val[7]/180;
    var rot_b=Math.PI*matrix_val[8]/180;
    var mirror_r=matrix_val[9];
    var mirror_g=matrix_val[10];
    var mirror_b=matrix_val[11];
    var scale_matrix=[[scale_r,0,0,0],[0,scale_g,0,0],[0,0,scale_b,0],[0,0,0,1]];
    var para_matrix=[[1,0,0,para_r],[0,1,0,para_g],[0,0,1,para_b],[0,0,0,1]];
    var para_r1_matrix=[[1,0,0,0],[0,1,0,-0.5],[0,0,1,-0.5],[0,0,0,1]];
    var para_r2_matrix=[[1,0,0,0],[0,1,0,0.5],[0,0,1,0.5],[0,0,0,1]];
    var para_g1_matrix=[[1,0,0,-0.5],[0,1,0,0],[0,0,1,-0.5],[0,0,0,1]];
    var para_g2_matrix=[[1,0,0,0.5],[0,1,0,0],[0,0,1,0.5],[0,0,0,1]];
    var para_b1_matrix=[[1,0,0,-0.5],[0,1,0,-0.5],[0,0,1,0],[0,0,0,1]];
    var para_b2_matrix=[[1,0,0,0.5],[0,1,0,0.5],[0,0,1,0],[0,0,0,1]];
    var rot_r_matrix=[[1,0,0,0],[0,Math.cos(rot_r),-Math.sin(rot_r),0],[0,Math.sin(rot_r),Math.cos(rot_r),0],[0,0,0,1]];
    var rot_g_matrix=[[Math.cos(rot_g),0,Math.sin(rot_g),0],[0,1,0,0],[-Math.sin(rot_g),0,Math.cos(rot_g),0],[0,0,0,1]];
    var rot_b_matrix=[[Math.cos(rot_b),-Math.sin(rot_b),0,0],[Math.sin(rot_b),Math.cos(rot_b),0,0],[0,0,1,0],[0,0,0,1]];
    var mirror_rg_matrix=[[1,0,0,0],[0,1,0,0],[0,0,mirror_r,0],[0,0,0,1]];
    var mirror_gb_matrix=[[mirror_g,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
    var mirror_br_matrix=[[1,0,0,0],[0,mirror_b,0,0],[0,0,1,0],[0,0,0,1]];
    //console.log("scale_matrix");
    //console.log(scale_matrix);
    //console.log("para_matrix");
    //console.log(para_matrix);
    var matrix=product(para_matrix,scale_matrix);
    //console.log(matrix);
    matrix=product(para_r1_matrix,matrix);
    matrix=product(rot_r_matrix,matrix);
    matrix=product(para_r2_matrix,matrix);
    //console.log(matrix);
    matrix=product(para_g2_matrix,matrix);
    matrix=product(rot_g_matrix,matrix);
    matrix=product(para_g1_matrix,matrix);
    //console.log(matrix);
    matrix=product(para_b1_matrix,matrix);
    matrix=product(rot_b_matrix,matrix);
    matrix=product(para_b2_matrix,matrix);
    //console.log(matrix);
    matrix=product(mirror_rg_matrix,matrix);
    //console.log(matrix);
    matrix=product(mirror_gb_matrix,matrix);
    //console.log(matrix);
    matrix=product(mirror_br_matrix,matrix);
    return round3(matrix);
}

function round3(matrix){
    var mn=is_matrix(matrix);
    for(let i=0;i<mn[0];i++){
        for(let j=0;j<mn[1];j++){
            matrix[i][j]=Math.round(matrix[i][j]*1000)/1000;
        }
    }
    return matrix;
}

function round1(matrix){
    var mn=is_matrix(matrix);
    for(let i=0;i<mn[0];i++){
        for(let j=0;j<mn[1];j++){
            matrix[i][j]=Math.round(matrix[i][j]*10)/10;
        }
    }
    return matrix;
}

function T(A){
    let mn=is_matrix(A);
    let tmp=zeros(mn[1],mn[0]);
    if(mn[1]==1){
        if(mn[0]==1){
            tmp=A;
        }else{
            for(i in A){
                tmp[i]=A[i][0];
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
    if(Amn[1]!==Bmn[0]){console.log('multiplication is not defined.');}
    let tmp=zeros(Amn[0],Bmn[1]).concat();
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
            for(let i=0;i<Amn[0];i++){
                for(let j=0;j<Amn[1];j++){
                    tmp[i][0]+=A[i][j]*B[j][0];
                }
            }
        }else{
            for(let i=0;i<Amn[0];i++){
                for(let j=0;j<Bmn[1];j++){
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
        row=array.length;
        col=array[0].length;
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
                let tmp=[];
                for(let j=0;j<col;j++){
                    tmp.push(0);
                }
                zeros.push(tmp);
            }
        }
    }
    return zeros;
}