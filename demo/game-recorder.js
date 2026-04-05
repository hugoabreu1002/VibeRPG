import puppeteer from 'puppeteer';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const SCREENSHOT_DIR = path.join(ROOT, 'demo/screenshots');
const OUTPUT_VIDEO = path.join(ROOT, 'demo/automated-gameplay.mp4');

ffmpeg.setFfmpegPath(ffmpegPath);

const DELAY_BETWEEN_SCREENSHOTS = 1200; // 1.2 seconds per frame
const TOTAL_SCREENSHOTS = 80; // 10 screenshots per game step

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearOldScreenshots() {
    const files = await fs.readdir(SCREENSHOT_DIR);
    for (const file of files) {
        if (file.endsWith('.png')) {
            await fs.unlink(path.join(SCREENSHOT_DIR, file));
        }
    }
    console.log('✅ Cleared old screenshots');
}

async function runGameBot() {
    console.log('🚀 Starting VibeRPG automated gameplay recorder...');

    await clearOldScreenshots();

    const browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: { width: 1280, height: 720 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();

        // First run the dev server or load local file
        console.log('📍 Loading game...');
        console.log('📍 Loading game...');
        await page.goto('http://localhost:5173');

        // ✅ START CAPTURING FROM LOADING SCREEN - EVERY STEP
        console.log('📸 Starting full capture from game boot');

        let frameCounter = 0;

        // Capture loading / splash screens (10 frames)
        for (let i = 0; i < 10; i++) {
            await page.screenshot({
                path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                fullPage: false,
                type: 'png'
            });
            await sleep(DELAY_BETWEEN_SCREENSHOTS);
        }

        console.log('✅ Game loaded, creating character');

        // ✅ Character creation step - capture every part of the process
        try {
            await page.waitForSelector('input[placeholder="Enter Hero Name"]', { timeout: 8000 });

            // Capture character creation form (10 frames)
            for (let i = 0; i < 10; i++) {
                await page.screenshot({
                    path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                    fullPage: false,
                    type: 'png'
                });
                await sleep(DELAY_BETWEEN_SCREENSHOTS);
            }

            // Fill form
            await page.click('input[placeholder="Enter Hero Name"]');
            await page.keyboard.type('Automaton');
            await sleep(400);

            // Switch through all classes to show selection
            for (const cls of ['warrior', 'mage', 'rogue', 'priest', 'archer']) {
                await page.select('select', cls);
                await sleep(500);
                await page.screenshot({
                    path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                    fullPage: false,
                    type: 'png'
                });
            }

            // Final selection
            await page.select('select', 'warrior');
            await sleep(600);

            // Capture final character preview before creating (5 frames)
            for (let i = 0; i < 5; i++) {
                await page.screenshot({
                    path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                    fullPage: false,
                    type: 'png'
                });
                await sleep(DELAY_BETWEEN_SCREENSHOTS);
            }

            // Create character
            await page.click('button[type="submit"]');
            await sleep(1500);

            // Capture character creation animation (10 frames)
            for (let i = 0; i < 10; i++) {
                await page.screenshot({
                    path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                    fullPage: false,
                    type: 'png'
                });
                await sleep(DELAY_BETWEEN_SCREENSHOTS);
            }

        } catch (e) {
            console.log('ℹ️  Using existing game save file');
        }

        console.log('✅ Character ready, navigating game');

        // ✅ Game navigation steps - 10 frames each tab with actual interactions
        const gameTabs = [
            {
                name: "Inventory", action: async () => {
                    // Scroll inventory, hover items
                    await page.mouse.move(600, 350);
                    await page.mouse.wheel({ deltaY: 200 });
                    await sleep(300);
                    // Click an item to show details
                    await page.mouse.click(650, 380);
                }
            },
            {
                name: "Shop", action: async () => {
                    // Browse shop items
                    await page.mouse.move(700, 300);
                    await sleep(400);
                    await page.mouse.click(720, 340);
                    await sleep(500);
                    // Scroll shop items
                    await page.mouse.wheel({ deltaY: 400 });
                }
            },
            {
                name: "Guild", action: async () => {
                    // Browse quests
                    await page.mouse.move(650, 280);
                    await sleep(400);
                    await page.mouse.click(680, 310);
                }
            },
            {
                name: "World Map", action: async () => {
                    // Nothing extra, movement happens after
                }
            }
        ];

        for (const tab of gameTabs) {
            try {
                await page.click(`button:has-text("${tab.name}")`);
                await sleep(1000);

                // Capture each tab with actual interactions during capture
                for (let i = 0; i < 12; i++) {
                    // Perform action on 3rd frame
                    if (i === 3 && tab.action) {
                        await tab.action();
                    }

                    await page.screenshot({
                        path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                        fullPage: false,
                        type: 'png'
                    });
                    await sleep(DELAY_BETWEEN_SCREENSHOTS);
                }
            } catch (e) { }
        }

        // ✅ World map gameplay - active movement (15 frames)
        for (let i = 0; i < 15; i++) {
            try {
                await page.mouse.move(
                    420 + Math.random() * 450,
                    240 + Math.random() * 320
                );

                if (i % 2 === 0) {
                    await page.mouse.click(
                        420 + Math.random() * 450,
                        240 + Math.random() * 320
                    );
                }
            } catch (e) { }

            await page.screenshot({
                path: path.join(SCREENSHOT_DIR, `frame-${String(frameCounter++).padStart(3, '0')}.png`),
                fullPage: false,
                type: 'png'
            });

            await sleep(DELAY_BETWEEN_SCREENSHOTS);
        }

        console.log(`✅ All ${frameCounter} screenshots captured successfully`);

        console.log('✅ All screenshots captured successfully');

    } finally {
        await browser.close();
    }
}

async function createVideo() {
    console.log('\n🎬 Generating video from screenshots...');

    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(path.join(SCREENSHOT_DIR, 'frame-%03d.png'))
            .inputFPS(0.5) // 2 seconds per frame matches our capture rate
            .outputFPS(30)
            .videoCodec('libx264')
            .outputOptions([
                '-pix_fmt yuv420p',
                '-crf 23',
                '-preset medium'
            ])
            .on('end', () => {
                console.log('✅ Video created successfully');
                resolve();
            })
            .on('error', (err) => {
                console.error('❌ Video creation failed:', err);
                reject(err);
            })
            .save(OUTPUT_VIDEO);
    });
}

async function main() {
    try {
        await runGameBot();
        await createVideo();

        console.log('\n🎉 Automation completed successfully!');
        console.log(`📹 Output video: ${OUTPUT_VIDEO}`);
        console.log(`🖼️  Screenshots stored in: ${SCREENSHOT_DIR}`);

    } catch (err) {
        console.error('❌ Automation failed:', err);
        process.exit(1);
    }
}

main();