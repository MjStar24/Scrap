const axios=require('axios');
const cheerio=require('cheerio');

const arr=[];
const allbranch=[];

const baseUri='https://www.iitg.ac.in/acad/CourseStructure/Btech2018/';

//to get the syllabus


const getSyllabus=async (link) => {
    let syllabus;
    try{
        const response = await axios.get(link.length < 30 ? `${baseUri}${link}` : link)
        const $$=cheerio.load(response.data);
        const tbody=$$('tbody');
        const big=$$('big');
        if(!(tbody.length>0)) {
            $$('p').each((i,e)=>{
            if($$(e).text().includes('yllabus') && $$(e).text().length<15){
                // console.log($$(e).next())
                if(big.length>0){
                    $$(e).nextAll('p').each((j,el)=>{
                        syllabus+=$$(el).text().replace('\n','');
                    })
                }else {
                let text=$$(e).next().text().replace(/\s\s+/g,'').replace('\n','')
                syllabus=text;
                }
            }
            else if($$(e).text().includes('yllabus')){
                
                    let text=$$(e).text().replace("Syllabus","").replace('\n','')
                    syllabus=text;
                
                
            }
            
        })
        }
        else {
            if($$('body > div > table > tbody > tr:nth-child(2) >td').length>0){
            $$('body > div > table > tbody > tr:nth-child(2) >td').find('p').each((i,el)=>{
                if($$(el).text().includes('yllabus')){
                    let text=$$(el).next().text().replace('\n','');
                    syllabus=text;
                }
            })
        }
        }
    }catch (e){
        // console.log(e);
    }

        return syllabus;
        
    
}


// to get the code and courseName

async function getData(link){
    try{
        const res= await axios.get(`${baseUri}${link}.htm`)
        let count = 0;
        const $=cheerio.load(res.data)
    
        
        $('tr').each((i,e)=>{
            count++;
        })
        for(let i=1;i<=count;i++){

            let code=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${1})`).text().replace(/\s\s+/g," ");
            let courseName=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${2})`).text().replace(/\s\s+/g," ")
            let link=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${2})`).find('a').attr('href');
            let Syllabus;
            if(link){
                Syllabus=await getSyllabus(link);
                
            }

            let code1=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${7})`).text().replace(/\s\s+/g," ");
            let courseName1=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${8})`).text().replace(/\s\s+/g," ")
            let link1=$(`body > div > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${8})`).find('a').attr('href');
            let Syllabus1;
            if(link1){
               Syllabus1=await getSyllabus(link1);
            }

            if(!(code.includes("ourse") || code=='' || code==' ' || !isNaN(code.replace(' ','')) || code=='  ') || !(code1.includes("ourse") || code1=='' || code1==' ' || !isNaN(code1.replace(' ','')))){
                arr.push({code,courseName,syllabus:Syllabus ? Syllabus : "Syllabus not uploaded"},
                    {code:code1,courseName:courseName1,Syllabus:Syllabus1 ? Syllabus1 : "Syllabus not uploaded"})
            }
            
        }
        return arr;
    }catch(e){
        return;
    }
    }




// to store details of all the branch
let branch=['CSE','CE','BT','EEE','ECE','CL','CST']
    


const branchdetails=async ()=>{
    for (let i=0;i<branch.length;i++){
        let course = branch[i];
        let data=await getData(course);
        allbranch.push(data);
    }
    // console.log(allbranch)
}
branchdetails();

