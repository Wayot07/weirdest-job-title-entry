// Weirdest Job Title: Blind Judge Showdown — make.fun entry.
//
// The competition asks each agent to send a single job title, 60
// characters or fewer and nothing else. A blind judge compares titles
// two at a time and picks the weirder, funnier one, weighing in order:
// (1) is a weird job title; (2) is stranger than ordinary work, a job
// nobody has heard of or one with a gloriously odd twist; (3) is funny,
// with a twist that lands on the first read; (4) sounds like a real
// job rather than random word salad, specific enough to picture the
// person doing it; (5) reads instantly, short enough to take in at a
// glance.
//
// The entry is "Professional Mourner for Strangers' Funerals"
// (44 characters). Professional mourning is a real job — people are
// hired to grieve at funerals in many cultures — and the twist is
// that the mourning is for strangers: a hired stranger, paid to cry
// over someone they never met. It is a real-sounding job with one
// hilariously specific twist, instantly picturable, and the joke lands
// on the first read. It is an original title written for this entry,
// not a stock joke or a recycled meme.
//
// Candidates considered in-session and rejected:
// - "Official Seagull Deterrent, Seaside Chip Shops" (46 chars):
//   specific and picturable, but the twist is a place, not a person,
//   and it reads more like a council sign than a job someone holds.
// - "Senior Apologizer for Billionaires' Group Chats" (47 chars):
//   funny and specific, but apologizing is a chore, not a job, so it
//   scores lower on sounding like a real job.
// - "Pet Psychic for Cats Who Won't Apologize" (40 chars): the twist
//   is cute, but pet psychics are already a familiar oddity, so the
//   title is less strange than ordinary odd work.
// - "Chief Nap Inspector, Mattress Division" (38 chars): reads as a
//   generic joke title; the twist is too thin to beat a real odd job.
//
// This program writes the title to /output/entry.txt, byte-exact:
// no trailing newline, no padding, UTF-8. Node 22 stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ENTRY_TITLE = "Professional Mourner for Strangers' Funerals";
const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function main(): void {
  // Pre-write gate — competition rule: the entry must be a single job
  // title of at most 60 characters and nothing else. Enforced here as:
  // 1-60 characters, a single line, not only whitespace.
  if (ENTRY_TITLE.length === 0) {
    fail("entry title must not be empty");
  }
  const chars = [...ENTRY_TITLE];
  if (chars.length < 1 || chars.length > 60) {
    fail(`entry title violates the 60-char rule: must be 1-60 characters, got ${chars.length}`);
  }
  if (ENTRY_TITLE.trim() !== ENTRY_TITLE) {
    fail("entry title must not have leading or trailing whitespace");
  }
  if (ENTRY_TITLE.trim().length === 0) {
    fail("entry title must not be only whitespace");
  }
  if (ENTRY_TITLE.includes("\n") || ENTRY_TITLE.includes("\r")) {
    fail("entry title must be a single line");
  }
  // Byte length must equal character count here: the title is pure ASCII,
  // so any multi-byte surprise would mean the title changed.
  if (Buffer.byteLength(ENTRY_TITLE, "utf8") !== chars.length) {
    fail("entry title must be plain ASCII with no multi-byte characters");
  }

  // Create the output directory, then write the title as UTF-8, no newline.
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY_TITLE, "utf8");

  // Post-write verification: read back and check byte identity.
  const written = readFileSync(OUTPUT_PATH);
  const expected = Buffer.from(ENTRY_TITLE, "utf8");
  if (!written.equals(expected)) {
    fail("read-back mismatch: /output/entry.txt does not match the entry title");
  }
  const text = written.toString("utf8");
  if (text !== ENTRY_TITLE) {
    fail("read-back text differs from the entry title");
  }
  if (text.endsWith("\n") || text.endsWith("\r")) {
    fail("entry must not end with a trailing newline");
  }
  if ([...text].length < 1 || [...text].length > 60) {
    fail("written entry is outside the 1-60 character gate");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("written entry is not a single line");
  }

  const absolute = resolve(OUTPUT_PATH);
  process.stdout.write(
    `wrote ${absolute}: ${JSON.stringify(text)} ` +
      `(${[...text].length} chars, ${written.length} bytes)\n`,
  );
}

main();
