// PPL 2023 HW4 Part2

// Q 2.1 

// Specify the return type.
export const delayedSum = (a: number, b: number, delay: number) : Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        setTimeout(() => {                                       
            if (isNaN(a) || isNaN(b)|| isNaN(delay)) {
                reject("Arguments must be numbers");
            }
            else if (delay <= 0) {
                reject("Delay must be non-negative");
            }
            else{
                resolve(a + b);
            }
        }, delay);
    });

}

export const testDelayedSum = () => { 
    const delay = 1000;
    const start = Date.now();
    delayedSum(1, 2, delay).then((result) => {
        const end = Date.now();
        const time = end - start;
        console.log(`Result: ${result}`);
        console.log(`Duration: ${time}`);
        console.log(`Test passed: ${time >= delay}`);
    })
    .catch((error) => {
        console.log(error);
    });
}
 

// Q 2.2

// Values returned by API calls.
export type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
}

// When invoking fetchData(postsUrl) you obtain an Array Post[]
// To obtain an array of posts
export const postsUrl = 'https://jsonplaceholder.typicode.com/posts'; 

// Append the desired post id.
export const postUrl = 'https://jsonplaceholder.typicode.com/posts/'; 

// When invoking fetchData(invalidUrl) you obtain an error
export const invalidUrl = 'https://jsonplaceholder.typicode.com/invalid';

// Depending on the url - fetchData can return either an array of Post[] or a single Post.
// Specify the return type without using any.
export const fetchData = async (url: string): Promise< Post[] | Post > => {
    try{
        const fetchedPromise = await fetch(url);
        const output = fetchedPromise.ok ? await fetchedPromise.json() : Promise.reject("Error");
        return output;
    }
    catch(error){  
        return Promise.reject("Error");
    } 
}


export const testFetchData = async () => {
    try{
        const posts = await fetchData(postsUrl);
        console.log("fetched posts : " , posts);
    }
    catch(error){
        console.error("ERROR fetching posts : " , error);
    }

    try{
        const singlePost = await fetchData(postUrl + '1');
        console.log("fetched post : ", singlePost);
    }
    catch(error){
        console.error("ERROR fetching post : ", error);
    }

    try{
        const invalidData = await fetchData(invalidUrl);
        console.log("fetched invalid post : ", invalidData);
    }
    catch(error){
        console.error("ERROR fetching invalid posts : ", error);
    }
}


// Q 2.3

// Specify the return type.
export const fetchMultipleUrls = async (urls: string[]) : Promise< (Post[] | Post)[] > => 
    await Promise.all(urls.map( url => fetchData(url)));

export const testFetchMultipleUrls = async () => {
    const urls = Array.from({length: 20}, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i+1}`); 
    // TEST : all single posts
    try {
        const posts = await fetchMultipleUrls(urls);
        console.log('Fetched posts:', posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    // TEST : all single posts except one that is invalid 
    urls[5] = invalidUrl;
    try {
        const posts = await fetchMultipleUrls(urls);
        console.log('Fetched posts:', posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
    // TEST : all single posts except one that has multiple posts
    urls[5] = postsUrl;
    try {
        const posts = await fetchMultipleUrls(urls);
        console.log('Fetched posts:', posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
