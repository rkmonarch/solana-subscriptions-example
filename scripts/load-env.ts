/**
 * Side-effect-only module that loads `.env` then `.env.local` (matching Next.js's own
 * precedence) into `process.env`. Must be the *first* import in any script that also imports
 * from `lib/solana/*`, so those modules see the right values when their top-level
 * `process.env.NEXT_PUBLIC_*` reads run — ES module imports are evaluated before any other
 * statement in the importing file, so a plain `dotenv.config()` call placed "before" other
 * imports textually would actually run *after* them.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
