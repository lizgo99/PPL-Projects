import { describe, expect, test } from '@jest/globals'
import {
    delayedSum, Post, postsUrl, postUrl, invalidUrl, fetchData, fetchMultipleUrls
} from '../src/part2';

describe('Assignment 4 Part 2', () => {
    
    describe('Q2.1 delayedSum (6 points)', () => {
        test('delayedSum returns the sum', () => {
            return delayedSum(1, 2, 1000).then(result => {
                expect(result).toBe(3);
            });
        
        })
        test('delayedSum waits at least the specified delay', () => {
            const delay = 1000;
            const start = Date.now();
            return delayedSum(1, 2, delay).then(() => {
                const end = Date.now();
                expect(end - start).toBeGreaterThanOrEqual(delay);
            });
        });
        
    })


    describe('Q2.2 fetchData (12 points)', () => {
        test('successful call to fetchData with array result', async () => {
            const data = await fetchData(postsUrl);
            expect(Array.isArray(data)).toBe(true);
            if (Array.isArray(data)) {
                expect(data.length).toBeGreaterThan(0);
            }
        })

        test('successful call to fetchData with Post result', async () => {
            const data = await fetchData(postUrl + '1');
            expect(Array.isArray(data)).toBe(false);
            if (!Array.isArray(data)) {
                expect(data.id).toBe(1);
            }
        })

        test('failed call to fetchData', async () => {
            await expect(fetchData(invalidUrl)).rejects.toEqual("Error");
        })

    })

    describe('Q2.3 fetchMultipleUrls (12 points)', () => {
        test('successful call to fetchMultipleUrls', async () => {
            const urls = Array.from({length: 20}, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i+1}`);
            const posts = await fetchMultipleUrls(urls);
            expect(posts.length).toBe(20);
        })

        test('successful call to fetchMultipleUrls: verify results are in the expected order ', async () => {
            const urls = Array.from({length: 20}, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i+1}`);
            const posts = await fetchMultipleUrls(urls);
            posts.forEach((post, i) => {
                if (!Array.isArray(post)) {
                    expect(post.id).toBe(i + 1);
                }
            })
        })

        test('failed call to fetchMultipleUrls', async () => {
            const urls = Array.from({length: 20}, (_, i) => `https://jsonplaceholder.typicode.com/posts/${i+1}`);
            urls[5] = invalidUrl;
            await expect(fetchMultipleUrls(urls)).rejects.toEqual("Error");
        })

    })
});

