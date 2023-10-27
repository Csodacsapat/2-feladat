export function factorial (n:number) : number{
    if(n === 0){
        return 1;
    }
    let result:number = 1;
    for(let i=1; i <= n ;i++){
        result *= i;
    }
    return result
}
