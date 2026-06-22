// src/accounts/decode.ts
import { getBase64Encoder } from "@solana/kit";

// src/generated/accounts/eventAuthority.ts
import {
  assertAccountExists,
  assertAccountsExist,
  combineCodec,
  decodeAccount,
  fetchEncodedAccount,
  fetchEncodedAccounts,
  getStructDecoder,
  getStructEncoder
} from "@solana/kit";

// src/generated/pdas/eventAuthority.ts
import { getProgramDerivedAddress, getUtf8Encoder } from "@solana/kit";
async function findEventAuthorityPda(config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress({ programAddress, seeds: [getUtf8Encoder().encode("event_authority")] });
}

// src/generated/pdas/fixedDelegation.ts
import {
  getAddressEncoder,
  getProgramDerivedAddress as getProgramDerivedAddress2,
  getU64Encoder,
  getUtf8Encoder as getUtf8Encoder2
} from "@solana/kit";
async function findFixedDelegationPda(seeds, config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress2({
    programAddress,
    seeds: [
      getUtf8Encoder2().encode("delegation"),
      getAddressEncoder().encode(seeds.subscriptionAuthority),
      getAddressEncoder().encode(seeds.delegator),
      getAddressEncoder().encode(seeds.delegatee),
      getU64Encoder().encode(seeds.nonce)
    ]
  });
}

// src/generated/pdas/plan.ts
import {
  getAddressEncoder as getAddressEncoder2,
  getProgramDerivedAddress as getProgramDerivedAddress3,
  getU64Encoder as getU64Encoder2,
  getUtf8Encoder as getUtf8Encoder3
} from "@solana/kit";
async function findPlanPda(seeds, config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress3({
    programAddress,
    seeds: [
      getUtf8Encoder3().encode("plan"),
      getAddressEncoder2().encode(seeds.owner),
      getU64Encoder2().encode(seeds.planId)
    ]
  });
}

// src/generated/pdas/recurringDelegation.ts
import {
  getAddressEncoder as getAddressEncoder3,
  getProgramDerivedAddress as getProgramDerivedAddress4,
  getU64Encoder as getU64Encoder3,
  getUtf8Encoder as getUtf8Encoder4
} from "@solana/kit";
async function findRecurringDelegationPda(seeds, config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress4({
    programAddress,
    seeds: [
      getUtf8Encoder4().encode("delegation"),
      getAddressEncoder3().encode(seeds.subscriptionAuthority),
      getAddressEncoder3().encode(seeds.delegator),
      getAddressEncoder3().encode(seeds.delegatee),
      getU64Encoder3().encode(seeds.nonce)
    ]
  });
}

// src/generated/pdas/subscriptionAuthority.ts
import {
  getAddressEncoder as getAddressEncoder4,
  getProgramDerivedAddress as getProgramDerivedAddress5,
  getUtf8Encoder as getUtf8Encoder5
} from "@solana/kit";
async function findSubscriptionAuthorityPda(seeds, config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress5({
    programAddress,
    seeds: [
      getUtf8Encoder5().encode("SubscriptionAuthority"),
      getAddressEncoder4().encode(seeds.user),
      getAddressEncoder4().encode(seeds.tokenMint)
    ]
  });
}

// src/generated/pdas/subscriptionDelegation.ts
import {
  getAddressEncoder as getAddressEncoder5,
  getProgramDerivedAddress as getProgramDerivedAddress6,
  getUtf8Encoder as getUtf8Encoder6
} from "@solana/kit";
async function findSubscriptionDelegationPda(seeds, config = {}) {
  const {
    programAddress = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44"
  } = config;
  return await getProgramDerivedAddress6({
    programAddress,
    seeds: [
      getUtf8Encoder6().encode("subscription"),
      getAddressEncoder5().encode(seeds.planPda),
      getAddressEncoder5().encode(seeds.subscriber)
    ]
  });
}

// src/generated/accounts/eventAuthority.ts
function getEventAuthorityEncoder() {
  return getStructEncoder([]);
}
function getEventAuthorityDecoder() {
  return getStructDecoder([]);
}
function getEventAuthorityCodec() {
  return combineCodec(getEventAuthorityEncoder(), getEventAuthorityDecoder());
}
function decodeEventAuthority(encodedAccount) {
  return decodeAccount(encodedAccount, getEventAuthorityDecoder());
}
async function fetchEventAuthority(rpc, address, config) {
  const maybeAccount = await fetchMaybeEventAuthority(rpc, address, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeEventAuthority(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount(rpc, address, config);
  return decodeEventAuthority(maybeAccount);
}
async function fetchAllEventAuthority(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeEventAuthority(rpc, addresses, config);
  assertAccountsExist(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeEventAuthority(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeEventAuthority(maybeAccount));
}
async function fetchEventAuthorityFromSeeds(rpc, config = {}) {
  const maybeAccount = await fetchMaybeEventAuthorityFromSeeds(rpc, config);
  assertAccountExists(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeEventAuthorityFromSeeds(rpc, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findEventAuthorityPda({ programAddress });
  return await fetchMaybeEventAuthority(rpc, address, fetchConfig);
}

// src/generated/accounts/fixedDelegation.ts
import {
  assertAccountExists as assertAccountExists2,
  assertAccountsExist as assertAccountsExist2,
  combineCodec as combineCodec12,
  decodeAccount as decodeAccount2,
  fetchEncodedAccount as fetchEncodedAccount2,
  fetchEncodedAccounts as fetchEncodedAccounts2,
  getAddressDecoder as getAddressDecoder6,
  getAddressEncoder as getAddressEncoder11,
  getI64Decoder as getI64Decoder8,
  getI64Encoder as getI64Encoder8,
  getStructDecoder as getStructDecoder10,
  getStructEncoder as getStructEncoder10,
  getU64Decoder as getU64Decoder7,
  getU64Encoder as getU64Encoder10
} from "@solana/kit";

// src/generated/types/accountDiscriminator.ts
import {
  combineCodec as combineCodec2,
  getEnumDecoder,
  getEnumEncoder
} from "@solana/kit";
var AccountDiscriminator = /* @__PURE__ */ ((AccountDiscriminator2) => {
  AccountDiscriminator2[AccountDiscriminator2["SubscriptionAuthority"] = 0] = "SubscriptionAuthority";
  AccountDiscriminator2[AccountDiscriminator2["Plan"] = 1] = "Plan";
  AccountDiscriminator2[AccountDiscriminator2["FixedDelegation"] = 2] = "FixedDelegation";
  AccountDiscriminator2[AccountDiscriminator2["RecurringDelegation"] = 3] = "RecurringDelegation";
  AccountDiscriminator2[AccountDiscriminator2["SubscriptionDelegation"] = 4] = "SubscriptionDelegation";
  return AccountDiscriminator2;
})(AccountDiscriminator || {});
function getAccountDiscriminatorEncoder() {
  return getEnumEncoder(AccountDiscriminator);
}
function getAccountDiscriminatorDecoder() {
  return getEnumDecoder(AccountDiscriminator);
}
function getAccountDiscriminatorCodec() {
  return combineCodec2(getAccountDiscriminatorEncoder(), getAccountDiscriminatorDecoder());
}

// src/generated/types/createFixedDelegationData.ts
import {
  combineCodec as combineCodec3,
  getI64Decoder,
  getI64Encoder,
  getStructDecoder as getStructDecoder2,
  getStructEncoder as getStructEncoder2,
  getU64Decoder,
  getU64Encoder as getU64Encoder4
} from "@solana/kit";
function getCreateFixedDelegationDataEncoder() {
  return getStructEncoder2([
    ["nonce", getU64Encoder4()],
    ["amount", getU64Encoder4()],
    ["expiryTs", getI64Encoder()],
    ["expectedSubscriptionAuthorityInitId", getI64Encoder()]
  ]);
}
function getCreateFixedDelegationDataDecoder() {
  return getStructDecoder2([
    ["nonce", getU64Decoder()],
    ["amount", getU64Decoder()],
    ["expiryTs", getI64Decoder()],
    ["expectedSubscriptionAuthorityInitId", getI64Decoder()]
  ]);
}
function getCreateFixedDelegationDataCodec() {
  return combineCodec3(getCreateFixedDelegationDataEncoder(), getCreateFixedDelegationDataDecoder());
}

// src/generated/types/createRecurringDelegationData.ts
import {
  combineCodec as combineCodec4,
  getI64Decoder as getI64Decoder2,
  getI64Encoder as getI64Encoder2,
  getStructDecoder as getStructDecoder3,
  getStructEncoder as getStructEncoder3,
  getU64Decoder as getU64Decoder2,
  getU64Encoder as getU64Encoder5
} from "@solana/kit";
function getCreateRecurringDelegationDataEncoder() {
  return getStructEncoder3([
    ["nonce", getU64Encoder5()],
    ["amountPerPeriod", getU64Encoder5()],
    ["periodLengthS", getU64Encoder5()],
    ["startTs", getI64Encoder2()],
    ["expiryTs", getI64Encoder2()],
    ["expectedSubscriptionAuthorityInitId", getI64Encoder2()]
  ]);
}
function getCreateRecurringDelegationDataDecoder() {
  return getStructDecoder3([
    ["nonce", getU64Decoder2()],
    ["amountPerPeriod", getU64Decoder2()],
    ["periodLengthS", getU64Decoder2()],
    ["startTs", getI64Decoder2()],
    ["expiryTs", getI64Decoder2()],
    ["expectedSubscriptionAuthorityInitId", getI64Decoder2()]
  ]);
}
function getCreateRecurringDelegationDataCodec() {
  return combineCodec4(getCreateRecurringDelegationDataEncoder(), getCreateRecurringDelegationDataDecoder());
}

// src/generated/types/header.ts
import {
  combineCodec as combineCodec5,
  getAddressDecoder,
  getAddressEncoder as getAddressEncoder6,
  getI64Decoder as getI64Decoder3,
  getI64Encoder as getI64Encoder3,
  getStructDecoder as getStructDecoder4,
  getStructEncoder as getStructEncoder4,
  getU8Decoder,
  getU8Encoder
} from "@solana/kit";
function getHeaderEncoder() {
  return getStructEncoder4([
    ["discriminator", getU8Encoder()],
    ["version", getU8Encoder()],
    ["bump", getU8Encoder()],
    ["delegator", getAddressEncoder6()],
    ["delegatee", getAddressEncoder6()],
    ["payer", getAddressEncoder6()],
    ["initId", getI64Encoder3()]
  ]);
}
function getHeaderDecoder() {
  return getStructDecoder4([
    ["discriminator", getU8Decoder()],
    ["version", getU8Decoder()],
    ["bump", getU8Decoder()],
    ["delegator", getAddressDecoder()],
    ["delegatee", getAddressDecoder()],
    ["payer", getAddressDecoder()],
    ["initId", getI64Decoder3()]
  ]);
}
function getHeaderCodec() {
  return combineCodec5(getHeaderEncoder(), getHeaderDecoder());
}

// src/generated/types/planData.ts
import {
  combineCodec as combineCodec6,
  fixDecoderSize,
  fixEncoderSize,
  getAddressDecoder as getAddressDecoder2,
  getAddressEncoder as getAddressEncoder7,
  getArrayDecoder,
  getArrayEncoder,
  getI64Decoder as getI64Decoder4,
  getI64Encoder as getI64Encoder4,
  getStructDecoder as getStructDecoder5,
  getStructEncoder as getStructEncoder5,
  getU64Decoder as getU64Decoder3,
  getU64Encoder as getU64Encoder6,
  getUtf8Decoder,
  getUtf8Encoder as getUtf8Encoder7
} from "@solana/kit";
function getPlanDataEncoder() {
  return getStructEncoder5([
    ["planId", getU64Encoder6()],
    ["mint", getAddressEncoder7()],
    ["terms", getPlanTermsEncoder()],
    ["endTs", getI64Encoder4()],
    ["destinations", getArrayEncoder(getAddressEncoder7(), { size: 4 })],
    ["pullers", getArrayEncoder(getAddressEncoder7(), { size: 4 })],
    ["metadataUri", fixEncoderSize(getUtf8Encoder7(), 128)]
  ]);
}
function getPlanDataDecoder() {
  return getStructDecoder5([
    ["planId", getU64Decoder3()],
    ["mint", getAddressDecoder2()],
    ["terms", getPlanTermsDecoder()],
    ["endTs", getI64Decoder4()],
    ["destinations", getArrayDecoder(getAddressDecoder2(), { size: 4 })],
    ["pullers", getArrayDecoder(getAddressDecoder2(), { size: 4 })],
    ["metadataUri", fixDecoderSize(getUtf8Decoder(), 128)]
  ]);
}
function getPlanDataCodec() {
  return combineCodec6(getPlanDataEncoder(), getPlanDataDecoder());
}

// src/generated/types/planStatus.ts
import {
  combineCodec as combineCodec7,
  getEnumDecoder as getEnumDecoder2,
  getEnumEncoder as getEnumEncoder2
} from "@solana/kit";
var PlanStatus = /* @__PURE__ */ ((PlanStatus2) => {
  PlanStatus2[PlanStatus2["Sunset"] = 0] = "Sunset";
  PlanStatus2[PlanStatus2["Active"] = 1] = "Active";
  return PlanStatus2;
})(PlanStatus || {});
function getPlanStatusEncoder() {
  return getEnumEncoder2(PlanStatus);
}
function getPlanStatusDecoder() {
  return getEnumDecoder2(PlanStatus);
}
function getPlanStatusCodec() {
  return combineCodec7(getPlanStatusEncoder(), getPlanStatusDecoder());
}

// src/generated/types/planTerms.ts
import {
  combineCodec as combineCodec8,
  getI64Decoder as getI64Decoder5,
  getI64Encoder as getI64Encoder5,
  getStructDecoder as getStructDecoder6,
  getStructEncoder as getStructEncoder6,
  getU64Decoder as getU64Decoder4,
  getU64Encoder as getU64Encoder7
} from "@solana/kit";
function getPlanTermsEncoder() {
  return getStructEncoder6([
    ["amount", getU64Encoder7()],
    ["periodHours", getU64Encoder7()],
    ["createdAt", getI64Encoder5()]
  ]);
}
function getPlanTermsDecoder() {
  return getStructDecoder6([
    ["amount", getU64Decoder4()],
    ["periodHours", getU64Decoder4()],
    ["createdAt", getI64Decoder5()]
  ]);
}
function getPlanTermsCodec() {
  return combineCodec8(getPlanTermsEncoder(), getPlanTermsDecoder());
}

// src/generated/types/subscribeData.ts
import {
  combineCodec as combineCodec9,
  getAddressDecoder as getAddressDecoder3,
  getAddressEncoder as getAddressEncoder8,
  getI64Decoder as getI64Decoder6,
  getI64Encoder as getI64Encoder6,
  getStructDecoder as getStructDecoder7,
  getStructEncoder as getStructEncoder7,
  getU64Decoder as getU64Decoder5,
  getU64Encoder as getU64Encoder8,
  getU8Decoder as getU8Decoder2,
  getU8Encoder as getU8Encoder2
} from "@solana/kit";
function getSubscribeDataEncoder() {
  return getStructEncoder7([
    ["planId", getU64Encoder8()],
    ["planBump", getU8Encoder2()],
    ["expectedMint", getAddressEncoder8()],
    ["expectedAmount", getU64Encoder8()],
    ["expectedPeriodHours", getU64Encoder8()],
    ["expectedCreatedAt", getI64Encoder6()],
    ["expectedSubscriptionAuthorityInitId", getI64Encoder6()]
  ]);
}
function getSubscribeDataDecoder() {
  return getStructDecoder7([
    ["planId", getU64Decoder5()],
    ["planBump", getU8Decoder2()],
    ["expectedMint", getAddressDecoder3()],
    ["expectedAmount", getU64Decoder5()],
    ["expectedPeriodHours", getU64Decoder5()],
    ["expectedCreatedAt", getI64Decoder6()],
    ["expectedSubscriptionAuthorityInitId", getI64Decoder6()]
  ]);
}
function getSubscribeDataCodec() {
  return combineCodec9(getSubscribeDataEncoder(), getSubscribeDataDecoder());
}

// src/generated/types/transferData.ts
import {
  combineCodec as combineCodec10,
  getAddressDecoder as getAddressDecoder4,
  getAddressEncoder as getAddressEncoder9,
  getStructDecoder as getStructDecoder8,
  getStructEncoder as getStructEncoder8,
  getU64Decoder as getU64Decoder6,
  getU64Encoder as getU64Encoder9
} from "@solana/kit";
function getTransferDataEncoder() {
  return getStructEncoder8([
    ["amount", getU64Encoder9()],
    ["delegator", getAddressEncoder9()],
    ["mint", getAddressEncoder9()]
  ]);
}
function getTransferDataDecoder() {
  return getStructDecoder8([
    ["amount", getU64Decoder6()],
    ["delegator", getAddressDecoder4()],
    ["mint", getAddressDecoder4()]
  ]);
}
function getTransferDataCodec() {
  return combineCodec10(getTransferDataEncoder(), getTransferDataDecoder());
}

// src/generated/types/updatePlanData.ts
import {
  combineCodec as combineCodec11,
  fixDecoderSize as fixDecoderSize2,
  fixEncoderSize as fixEncoderSize2,
  getAddressDecoder as getAddressDecoder5,
  getAddressEncoder as getAddressEncoder10,
  getArrayDecoder as getArrayDecoder2,
  getArrayEncoder as getArrayEncoder2,
  getI64Decoder as getI64Decoder7,
  getI64Encoder as getI64Encoder7,
  getStructDecoder as getStructDecoder9,
  getStructEncoder as getStructEncoder9,
  getU8Decoder as getU8Decoder3,
  getU8Encoder as getU8Encoder3,
  getUtf8Decoder as getUtf8Decoder2,
  getUtf8Encoder as getUtf8Encoder8
} from "@solana/kit";
function getUpdatePlanDataEncoder() {
  return getStructEncoder9([
    ["status", getU8Encoder3()],
    ["endTs", getI64Encoder7()],
    ["pullers", getArrayEncoder2(getAddressEncoder10(), { size: 4 })],
    ["metadataUri", fixEncoderSize2(getUtf8Encoder8(), 128)]
  ]);
}
function getUpdatePlanDataDecoder() {
  return getStructDecoder9([
    ["status", getU8Decoder3()],
    ["endTs", getI64Decoder7()],
    ["pullers", getArrayDecoder2(getAddressDecoder5(), { size: 4 })],
    ["metadataUri", fixDecoderSize2(getUtf8Decoder2(), 128)]
  ]);
}
function getUpdatePlanDataCodec() {
  return combineCodec11(getUpdatePlanDataEncoder(), getUpdatePlanDataDecoder());
}

// src/generated/accounts/fixedDelegation.ts
function getFixedDelegationEncoder() {
  return getStructEncoder10([
    ["header", getHeaderEncoder()],
    ["subscriptionAuthority", getAddressEncoder11()],
    ["mint", getAddressEncoder11()],
    ["amount", getU64Encoder10()],
    ["expiryTs", getI64Encoder8()]
  ]);
}
function getFixedDelegationDecoder() {
  return getStructDecoder10([
    ["header", getHeaderDecoder()],
    ["subscriptionAuthority", getAddressDecoder6()],
    ["mint", getAddressDecoder6()],
    ["amount", getU64Decoder7()],
    ["expiryTs", getI64Decoder8()]
  ]);
}
function getFixedDelegationCodec() {
  return combineCodec12(getFixedDelegationEncoder(), getFixedDelegationDecoder());
}
function decodeFixedDelegation(encodedAccount) {
  return decodeAccount2(encodedAccount, getFixedDelegationDecoder());
}
async function fetchFixedDelegation(rpc, address, config) {
  const maybeAccount = await fetchMaybeFixedDelegation(rpc, address, config);
  assertAccountExists2(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeFixedDelegation(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount2(rpc, address, config);
  return decodeFixedDelegation(maybeAccount);
}
async function fetchAllFixedDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeFixedDelegation(rpc, addresses, config);
  assertAccountsExist2(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeFixedDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts2(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeFixedDelegation(maybeAccount));
}
async function fetchFixedDelegationFromSeeds(rpc, seeds, config = {}) {
  const maybeAccount = await fetchMaybeFixedDelegationFromSeeds(rpc, seeds, config);
  assertAccountExists2(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeFixedDelegationFromSeeds(rpc, seeds, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findFixedDelegationPda(seeds, { programAddress });
  return await fetchMaybeFixedDelegation(rpc, address, fetchConfig);
}

// src/generated/accounts/plan.ts
import {
  assertAccountExists as assertAccountExists3,
  assertAccountsExist as assertAccountsExist3,
  combineCodec as combineCodec13,
  decodeAccount as decodeAccount3,
  fetchEncodedAccount as fetchEncodedAccount3,
  fetchEncodedAccounts as fetchEncodedAccounts3,
  getAddressDecoder as getAddressDecoder7,
  getAddressEncoder as getAddressEncoder12,
  getStructDecoder as getStructDecoder11,
  getStructEncoder as getStructEncoder11,
  getU8Decoder as getU8Decoder4,
  getU8Encoder as getU8Encoder4
} from "@solana/kit";
function getPlanEncoder() {
  return getStructEncoder11([
    ["discriminator", getU8Encoder4()],
    ["owner", getAddressEncoder12()],
    ["bump", getU8Encoder4()],
    ["status", getU8Encoder4()],
    ["data", getPlanDataEncoder()]
  ]);
}
function getPlanDecoder() {
  return getStructDecoder11([
    ["discriminator", getU8Decoder4()],
    ["owner", getAddressDecoder7()],
    ["bump", getU8Decoder4()],
    ["status", getU8Decoder4()],
    ["data", getPlanDataDecoder()]
  ]);
}
function getPlanCodec() {
  return combineCodec13(getPlanEncoder(), getPlanDecoder());
}
function decodePlan(encodedAccount) {
  return decodeAccount3(encodedAccount, getPlanDecoder());
}
async function fetchPlan(rpc, address, config) {
  const maybeAccount = await fetchMaybePlan(rpc, address, config);
  assertAccountExists3(maybeAccount);
  return maybeAccount;
}
async function fetchMaybePlan(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount3(rpc, address, config);
  return decodePlan(maybeAccount);
}
async function fetchAllPlan(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybePlan(rpc, addresses, config);
  assertAccountsExist3(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybePlan(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts3(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodePlan(maybeAccount));
}
async function fetchPlanFromSeeds(rpc, seeds, config = {}) {
  const maybeAccount = await fetchMaybePlanFromSeeds(rpc, seeds, config);
  assertAccountExists3(maybeAccount);
  return maybeAccount;
}
async function fetchMaybePlanFromSeeds(rpc, seeds, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findPlanPda(seeds, { programAddress });
  return await fetchMaybePlan(rpc, address, fetchConfig);
}

// src/generated/accounts/recurringDelegation.ts
import {
  assertAccountExists as assertAccountExists4,
  assertAccountsExist as assertAccountsExist4,
  combineCodec as combineCodec14,
  decodeAccount as decodeAccount4,
  fetchEncodedAccount as fetchEncodedAccount4,
  fetchEncodedAccounts as fetchEncodedAccounts4,
  getAddressDecoder as getAddressDecoder8,
  getAddressEncoder as getAddressEncoder13,
  getI64Decoder as getI64Decoder9,
  getI64Encoder as getI64Encoder9,
  getStructDecoder as getStructDecoder12,
  getStructEncoder as getStructEncoder12,
  getU64Decoder as getU64Decoder8,
  getU64Encoder as getU64Encoder11
} from "@solana/kit";
function getRecurringDelegationEncoder() {
  return getStructEncoder12([
    ["header", getHeaderEncoder()],
    ["subscriptionAuthority", getAddressEncoder13()],
    ["mint", getAddressEncoder13()],
    ["currentPeriodStartTs", getI64Encoder9()],
    ["periodLengthS", getU64Encoder11()],
    ["expiryTs", getI64Encoder9()],
    ["amountPerPeriod", getU64Encoder11()],
    ["amountPulledInPeriod", getU64Encoder11()]
  ]);
}
function getRecurringDelegationDecoder() {
  return getStructDecoder12([
    ["header", getHeaderDecoder()],
    ["subscriptionAuthority", getAddressDecoder8()],
    ["mint", getAddressDecoder8()],
    ["currentPeriodStartTs", getI64Decoder9()],
    ["periodLengthS", getU64Decoder8()],
    ["expiryTs", getI64Decoder9()],
    ["amountPerPeriod", getU64Decoder8()],
    ["amountPulledInPeriod", getU64Decoder8()]
  ]);
}
function getRecurringDelegationCodec() {
  return combineCodec14(getRecurringDelegationEncoder(), getRecurringDelegationDecoder());
}
function decodeRecurringDelegation(encodedAccount) {
  return decodeAccount4(encodedAccount, getRecurringDelegationDecoder());
}
async function fetchRecurringDelegation(rpc, address, config) {
  const maybeAccount = await fetchMaybeRecurringDelegation(rpc, address, config);
  assertAccountExists4(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeRecurringDelegation(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount4(rpc, address, config);
  return decodeRecurringDelegation(maybeAccount);
}
async function fetchAllRecurringDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeRecurringDelegation(rpc, addresses, config);
  assertAccountsExist4(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeRecurringDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts4(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeRecurringDelegation(maybeAccount));
}
async function fetchRecurringDelegationFromSeeds(rpc, seeds, config = {}) {
  const maybeAccount = await fetchMaybeRecurringDelegationFromSeeds(rpc, seeds, config);
  assertAccountExists4(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeRecurringDelegationFromSeeds(rpc, seeds, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findRecurringDelegationPda(seeds, { programAddress });
  return await fetchMaybeRecurringDelegation(rpc, address, fetchConfig);
}

// src/generated/accounts/subscriptionAuthority.ts
import {
  assertAccountExists as assertAccountExists5,
  assertAccountsExist as assertAccountsExist5,
  combineCodec as combineCodec15,
  decodeAccount as decodeAccount5,
  fetchEncodedAccount as fetchEncodedAccount5,
  fetchEncodedAccounts as fetchEncodedAccounts5,
  getAddressDecoder as getAddressDecoder9,
  getAddressEncoder as getAddressEncoder14,
  getI64Decoder as getI64Decoder10,
  getI64Encoder as getI64Encoder10,
  getStructDecoder as getStructDecoder13,
  getStructEncoder as getStructEncoder13,
  getU8Decoder as getU8Decoder5,
  getU8Encoder as getU8Encoder5
} from "@solana/kit";
function getSubscriptionAuthorityEncoder() {
  return getStructEncoder13([
    ["discriminator", getU8Encoder5()],
    ["user", getAddressEncoder14()],
    ["tokenMint", getAddressEncoder14()],
    ["payer", getAddressEncoder14()],
    ["bump", getU8Encoder5()],
    ["initId", getI64Encoder10()]
  ]);
}
function getSubscriptionAuthorityDecoder() {
  return getStructDecoder13([
    ["discriminator", getU8Decoder5()],
    ["user", getAddressDecoder9()],
    ["tokenMint", getAddressDecoder9()],
    ["payer", getAddressDecoder9()],
    ["bump", getU8Decoder5()],
    ["initId", getI64Decoder10()]
  ]);
}
function getSubscriptionAuthorityCodec() {
  return combineCodec15(getSubscriptionAuthorityEncoder(), getSubscriptionAuthorityDecoder());
}
function decodeSubscriptionAuthority(encodedAccount) {
  return decodeAccount5(encodedAccount, getSubscriptionAuthorityDecoder());
}
async function fetchSubscriptionAuthority(rpc, address, config) {
  const maybeAccount = await fetchMaybeSubscriptionAuthority(rpc, address, config);
  assertAccountExists5(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeSubscriptionAuthority(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount5(rpc, address, config);
  return decodeSubscriptionAuthority(maybeAccount);
}
async function fetchAllSubscriptionAuthority(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeSubscriptionAuthority(rpc, addresses, config);
  assertAccountsExist5(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeSubscriptionAuthority(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts5(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeSubscriptionAuthority(maybeAccount));
}
async function fetchSubscriptionAuthorityFromSeeds(rpc, seeds, config = {}) {
  const maybeAccount = await fetchMaybeSubscriptionAuthorityFromSeeds(rpc, seeds, config);
  assertAccountExists5(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeSubscriptionAuthorityFromSeeds(rpc, seeds, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findSubscriptionAuthorityPda(seeds, { programAddress });
  return await fetchMaybeSubscriptionAuthority(rpc, address, fetchConfig);
}

// src/generated/accounts/subscriptionDelegation.ts
import {
  assertAccountExists as assertAccountExists6,
  assertAccountsExist as assertAccountsExist6,
  combineCodec as combineCodec16,
  decodeAccount as decodeAccount6,
  fetchEncodedAccount as fetchEncodedAccount6,
  fetchEncodedAccounts as fetchEncodedAccounts6,
  getI64Decoder as getI64Decoder11,
  getI64Encoder as getI64Encoder11,
  getStructDecoder as getStructDecoder14,
  getStructEncoder as getStructEncoder14,
  getU64Decoder as getU64Decoder9,
  getU64Encoder as getU64Encoder12
} from "@solana/kit";
function getSubscriptionDelegationEncoder() {
  return getStructEncoder14([
    ["header", getHeaderEncoder()],
    ["terms", getPlanTermsEncoder()],
    ["amountPulledInPeriod", getU64Encoder12()],
    ["currentPeriodStartTs", getI64Encoder11()],
    ["expiresAtTs", getI64Encoder11()]
  ]);
}
function getSubscriptionDelegationDecoder() {
  return getStructDecoder14([
    ["header", getHeaderDecoder()],
    ["terms", getPlanTermsDecoder()],
    ["amountPulledInPeriod", getU64Decoder9()],
    ["currentPeriodStartTs", getI64Decoder11()],
    ["expiresAtTs", getI64Decoder11()]
  ]);
}
function getSubscriptionDelegationCodec() {
  return combineCodec16(getSubscriptionDelegationEncoder(), getSubscriptionDelegationDecoder());
}
function decodeSubscriptionDelegation(encodedAccount) {
  return decodeAccount6(encodedAccount, getSubscriptionDelegationDecoder());
}
async function fetchSubscriptionDelegation(rpc, address, config) {
  const maybeAccount = await fetchMaybeSubscriptionDelegation(rpc, address, config);
  assertAccountExists6(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeSubscriptionDelegation(rpc, address, config) {
  const maybeAccount = await fetchEncodedAccount6(rpc, address, config);
  return decodeSubscriptionDelegation(maybeAccount);
}
async function fetchAllSubscriptionDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchAllMaybeSubscriptionDelegation(rpc, addresses, config);
  assertAccountsExist6(maybeAccounts);
  return maybeAccounts;
}
async function fetchAllMaybeSubscriptionDelegation(rpc, addresses, config) {
  const maybeAccounts = await fetchEncodedAccounts6(rpc, addresses, config);
  return maybeAccounts.map((maybeAccount) => decodeSubscriptionDelegation(maybeAccount));
}
async function fetchSubscriptionDelegationFromSeeds(rpc, seeds, config = {}) {
  const maybeAccount = await fetchMaybeSubscriptionDelegationFromSeeds(rpc, seeds, config);
  assertAccountExists6(maybeAccount);
  return maybeAccount;
}
async function fetchMaybeSubscriptionDelegationFromSeeds(rpc, seeds, config = {}) {
  const { programAddress, ...fetchConfig } = config;
  const [address] = await findSubscriptionDelegationPda(seeds, { programAddress });
  return await fetchMaybeSubscriptionDelegation(rpc, address, fetchConfig);
}

// src/generated/errors/subscriptions.ts
import {
  isProgramError
} from "@solana/kit";

// src/generated/programs/subscriptions.ts
import {
  assertIsInstructionWithAccounts,
  containsBytes,
  extendClient,
  getU8Encoder as getU8Encoder22,
  SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION,
  SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE,
  SolanaError as SolanaError17
} from "@solana/kit";
import {
  addSelfFetchFunctions,
  addSelfPlanAndSendFunctions
} from "@solana/program-client-core";

// src/generated/instructions/cancelSubscription.ts
import {
  combineCodec as combineCodec17,
  getStructDecoder as getStructDecoder15,
  getStructEncoder as getStructEncoder15,
  getU8Decoder as getU8Decoder6,
  getU8Encoder as getU8Encoder6,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS,
  SolanaError,
  transformEncoder
} from "@solana/kit";
import {
  getAccountMetaFactory,
  getAddressFromResolvedInstructionAccount
} from "@solana/program-client-core";
var CANCEL_SUBSCRIPTION_DISCRIMINATOR = 12;
function getCancelSubscriptionDiscriminatorBytes() {
  return getU8Encoder6().encode(CANCEL_SUBSCRIPTION_DISCRIMINATOR);
}
function getCancelSubscriptionInstructionDataEncoder() {
  return transformEncoder(getStructEncoder15([["discriminator", getU8Encoder6()]]), (value) => ({
    ...value,
    discriminator: CANCEL_SUBSCRIPTION_DISCRIMINATOR
  }));
}
function getCancelSubscriptionInstructionDataDecoder() {
  return getStructDecoder15([["discriminator", getU8Decoder6()]]);
}
function getCancelSubscriptionInstructionDataCodec() {
  return combineCodec17(getCancelSubscriptionInstructionDataEncoder(), getCancelSubscriptionInstructionDataDecoder());
}
async function getCancelSubscriptionInstructionAsync(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.subscriptionPda.value) {
    accounts.subscriptionPda.value = await findSubscriptionDelegationPda({
      planPda: getAddressFromResolvedInstructionAccount("planPda", accounts.planPda.value),
      subscriber: getAddressFromResolvedInstructionAccount("subscriber", accounts.subscriber.value)
    });
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getCancelSubscriptionInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getCancelSubscriptionInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getCancelSubscriptionInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseCancelSubscriptionInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 5
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      subscriber: getNextAccount(),
      planPda: getNextAccount(),
      subscriptionPda: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getCancelSubscriptionInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/closeSubscriptionAuthority.ts
import {
  combineCodec as combineCodec18,
  getStructDecoder as getStructDecoder16,
  getStructEncoder as getStructEncoder16,
  getU8Decoder as getU8Decoder7,
  getU8Encoder as getU8Encoder7,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2,
  SolanaError as SolanaError2,
  transformEncoder as transformEncoder2
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory2 } from "@solana/program-client-core";
var CLOSE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR = 6;
function getCloseSubscriptionAuthorityDiscriminatorBytes() {
  return getU8Encoder7().encode(CLOSE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR);
}
function getCloseSubscriptionAuthorityInstructionDataEncoder() {
  return transformEncoder2(getStructEncoder16([["discriminator", getU8Encoder7()]]), (value) => ({
    ...value,
    discriminator: CLOSE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR
  }));
}
function getCloseSubscriptionAuthorityInstructionDataDecoder() {
  return getStructDecoder16([["discriminator", getU8Decoder7()]]);
}
function getCloseSubscriptionAuthorityInstructionDataCodec() {
  return combineCodec18(
    getCloseSubscriptionAuthorityInstructionDataEncoder(),
    getCloseSubscriptionAuthorityInstructionDataDecoder()
  );
}
function getCloseSubscriptionAuthorityInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    user: { value: input.user ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: true }
  };
  const accounts = originalAccounts;
  const getAccountMeta = getAccountMetaFactory2(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("user", accounts.user),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority)
    ],
    data: getCloseSubscriptionAuthorityInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseCloseSubscriptionAuthorityInstruction(instruction) {
  if (instruction.accounts.length < 2) {
    throw new SolanaError2(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS2, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 2
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: { user: getNextAccount(), subscriptionAuthority: getNextAccount() },
    data: getCloseSubscriptionAuthorityInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/createFixedDelegation.ts
import {
  combineCodec as combineCodec19,
  getStructDecoder as getStructDecoder17,
  getStructEncoder as getStructEncoder17,
  getU8Decoder as getU8Decoder8,
  getU8Encoder as getU8Encoder8,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3,
  SolanaError as SolanaError3,
  transformEncoder as transformEncoder3
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory3 } from "@solana/program-client-core";
var CREATE_FIXED_DELEGATION_DISCRIMINATOR = 1;
function getCreateFixedDelegationDiscriminatorBytes() {
  return getU8Encoder8().encode(CREATE_FIXED_DELEGATION_DISCRIMINATOR);
}
function getCreateFixedDelegationInstructionDataEncoder() {
  return transformEncoder3(
    getStructEncoder17([
      ["discriminator", getU8Encoder8()],
      ["fixedDelegation", getCreateFixedDelegationDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_FIXED_DELEGATION_DISCRIMINATOR })
  );
}
function getCreateFixedDelegationInstructionDataDecoder() {
  return getStructDecoder17([
    ["discriminator", getU8Decoder8()],
    ["fixedDelegation", getCreateFixedDelegationDataDecoder()]
  ]);
}
function getCreateFixedDelegationInstructionDataCodec() {
  return combineCodec19(
    getCreateFixedDelegationInstructionDataEncoder(),
    getCreateFixedDelegationInstructionDataDecoder()
  );
}
function getCreateFixedDelegationInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    delegator: { value: input.delegator ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false },
    delegationAccount: { value: input.delegationAccount ?? null, isWritable: true },
    delegatee: { value: input.delegatee ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory3(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("delegator", accounts.delegator),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("delegationAccount", accounts.delegationAccount),
      getAccountMeta("delegatee", accounts.delegatee),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateFixedDelegationInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseCreateFixedDelegationInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError3(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS3, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 5
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      delegator: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      delegationAccount: getNextAccount(),
      delegatee: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCreateFixedDelegationInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/createPlan.ts
import {
  combineCodec as combineCodec20,
  getStructDecoder as getStructDecoder18,
  getStructEncoder as getStructEncoder18,
  getU8Decoder as getU8Decoder9,
  getU8Encoder as getU8Encoder9,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4,
  SolanaError as SolanaError4,
  transformEncoder as transformEncoder4
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory4 } from "@solana/program-client-core";
var CREATE_PLAN_DISCRIMINATOR = 7;
function getCreatePlanDiscriminatorBytes() {
  return getU8Encoder9().encode(CREATE_PLAN_DISCRIMINATOR);
}
function getCreatePlanInstructionDataEncoder() {
  return transformEncoder4(
    getStructEncoder18([
      ["discriminator", getU8Encoder9()],
      ["planData", getPlanDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_PLAN_DISCRIMINATOR })
  );
}
function getCreatePlanInstructionDataDecoder() {
  return getStructDecoder18([
    ["discriminator", getU8Decoder9()],
    ["planData", getPlanDataDecoder()]
  ]);
}
function getCreatePlanInstructionDataCodec() {
  return combineCodec20(getCreatePlanInstructionDataEncoder(), getCreatePlanInstructionDataDecoder());
}
function getCreatePlanInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    merchant: { value: input.merchant ?? null, isWritable: true },
    planPda: { value: input.planPda ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  if (!accounts.tokenProgram.value) {
    accounts.tokenProgram.value = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
  }
  const getAccountMeta = getAccountMetaFactory4(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("merchant", accounts.merchant),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("systemProgram", accounts.systemProgram),
      getAccountMeta("tokenProgram", accounts.tokenProgram)
    ],
    data: getCreatePlanInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseCreatePlanInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError4(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS4, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 5
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      merchant: getNextAccount(),
      planPda: getNextAccount(),
      tokenMint: getNextAccount(),
      systemProgram: getNextAccount(),
      tokenProgram: getNextAccount()
    },
    data: getCreatePlanInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/createRecurringDelegation.ts
import {
  combineCodec as combineCodec21,
  getStructDecoder as getStructDecoder19,
  getStructEncoder as getStructEncoder19,
  getU8Decoder as getU8Decoder10,
  getU8Encoder as getU8Encoder10,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5,
  SolanaError as SolanaError5,
  transformEncoder as transformEncoder5
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory5 } from "@solana/program-client-core";
var CREATE_RECURRING_DELEGATION_DISCRIMINATOR = 2;
function getCreateRecurringDelegationDiscriminatorBytes() {
  return getU8Encoder10().encode(CREATE_RECURRING_DELEGATION_DISCRIMINATOR);
}
function getCreateRecurringDelegationInstructionDataEncoder() {
  return transformEncoder5(
    getStructEncoder19([
      ["discriminator", getU8Encoder10()],
      ["recurringDelegation", getCreateRecurringDelegationDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: CREATE_RECURRING_DELEGATION_DISCRIMINATOR })
  );
}
function getCreateRecurringDelegationInstructionDataDecoder() {
  return getStructDecoder19([
    ["discriminator", getU8Decoder10()],
    ["recurringDelegation", getCreateRecurringDelegationDataDecoder()]
  ]);
}
function getCreateRecurringDelegationInstructionDataCodec() {
  return combineCodec21(
    getCreateRecurringDelegationInstructionDataEncoder(),
    getCreateRecurringDelegationInstructionDataDecoder()
  );
}
function getCreateRecurringDelegationInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    delegator: { value: input.delegator ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false },
    delegationAccount: { value: input.delegationAccount ?? null, isWritable: true },
    delegatee: { value: input.delegatee ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory5(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("delegator", accounts.delegator),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("delegationAccount", accounts.delegationAccount),
      getAccountMeta("delegatee", accounts.delegatee),
      getAccountMeta("systemProgram", accounts.systemProgram)
    ],
    data: getCreateRecurringDelegationInstructionDataEncoder().encode(
      args
    ),
    programAddress
  });
}
function parseCreateRecurringDelegationInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError5(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS5, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 5
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      delegator: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      delegationAccount: getNextAccount(),
      delegatee: getNextAccount(),
      systemProgram: getNextAccount()
    },
    data: getCreateRecurringDelegationInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/deletePlan.ts
import {
  combineCodec as combineCodec22,
  getStructDecoder as getStructDecoder20,
  getStructEncoder as getStructEncoder20,
  getU8Decoder as getU8Decoder11,
  getU8Encoder as getU8Encoder11,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6,
  SolanaError as SolanaError6,
  transformEncoder as transformEncoder6
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory6 } from "@solana/program-client-core";
var DELETE_PLAN_DISCRIMINATOR = 9;
function getDeletePlanDiscriminatorBytes() {
  return getU8Encoder11().encode(DELETE_PLAN_DISCRIMINATOR);
}
function getDeletePlanInstructionDataEncoder() {
  return transformEncoder6(getStructEncoder20([["discriminator", getU8Encoder11()]]), (value) => ({
    ...value,
    discriminator: DELETE_PLAN_DISCRIMINATOR
  }));
}
function getDeletePlanInstructionDataDecoder() {
  return getStructDecoder20([["discriminator", getU8Decoder11()]]);
}
function getDeletePlanInstructionDataCodec() {
  return combineCodec22(getDeletePlanInstructionDataEncoder(), getDeletePlanInstructionDataDecoder());
}
function getDeletePlanInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    owner: { value: input.owner ?? null, isWritable: true },
    planPda: { value: input.planPda ?? null, isWritable: true }
  };
  const accounts = originalAccounts;
  const getAccountMeta = getAccountMetaFactory6(programAddress, "programId");
  return Object.freeze({
    accounts: [getAccountMeta("owner", accounts.owner), getAccountMeta("planPda", accounts.planPda)],
    data: getDeletePlanInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseDeletePlanInstruction(instruction) {
  if (instruction.accounts.length < 2) {
    throw new SolanaError6(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS6, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 2
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: { owner: getNextAccount(), planPda: getNextAccount() },
    data: getDeletePlanInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/initSubscriptionAuthority.ts
import {
  combineCodec as combineCodec23,
  getStructDecoder as getStructDecoder21,
  getStructEncoder as getStructEncoder21,
  getU8Decoder as getU8Decoder12,
  getU8Encoder as getU8Encoder12,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7,
  SolanaError as SolanaError7,
  transformEncoder as transformEncoder7
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory7,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount2
} from "@solana/program-client-core";
var INIT_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR = 0;
function getInitSubscriptionAuthorityDiscriminatorBytes() {
  return getU8Encoder12().encode(INIT_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR);
}
function getInitSubscriptionAuthorityInstructionDataEncoder() {
  return transformEncoder7(getStructEncoder21([["discriminator", getU8Encoder12()]]), (value) => ({
    ...value,
    discriminator: INIT_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR
  }));
}
function getInitSubscriptionAuthorityInstructionDataDecoder() {
  return getStructDecoder21([["discriminator", getU8Decoder12()]]);
}
function getInitSubscriptionAuthorityInstructionDataCodec() {
  return combineCodec23(
    getInitSubscriptionAuthorityInstructionDataEncoder(),
    getInitSubscriptionAuthorityInstructionDataDecoder()
  );
}
async function getInitSubscriptionAuthorityInstructionAsync(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    owner: { value: input.owner ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    userAta: { value: input.userAta ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.subscriptionAuthority.value) {
    accounts.subscriptionAuthority.value = await findSubscriptionAuthorityPda({
      user: getAddressFromResolvedInstructionAccount2("owner", accounts.owner.value),
      tokenMint: getAddressFromResolvedInstructionAccount2("tokenMint", accounts.tokenMint.value)
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("userAta", accounts.userAta),
      getAccountMeta("systemProgram", accounts.systemProgram),
      getAccountMeta("tokenProgram", accounts.tokenProgram)
    ],
    data: getInitSubscriptionAuthorityInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getInitSubscriptionAuthorityInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    owner: { value: input.owner ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    userAta: { value: input.userAta ?? null, isWritable: true },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  const getAccountMeta = getAccountMetaFactory7(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("owner", accounts.owner),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("userAta", accounts.userAta),
      getAccountMeta("systemProgram", accounts.systemProgram),
      getAccountMeta("tokenProgram", accounts.tokenProgram)
    ],
    data: getInitSubscriptionAuthorityInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseInitSubscriptionAuthorityInstruction(instruction) {
  if (instruction.accounts.length < 6) {
    throw new SolanaError7(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS7, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 6
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      owner: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      tokenMint: getNextAccount(),
      userAta: getNextAccount(),
      systemProgram: getNextAccount(),
      tokenProgram: getNextAccount()
    },
    data: getInitSubscriptionAuthorityInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/resumeSubscription.ts
import {
  combineCodec as combineCodec24,
  getStructDecoder as getStructDecoder22,
  getStructEncoder as getStructEncoder22,
  getU8Decoder as getU8Decoder13,
  getU8Encoder as getU8Encoder13,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8,
  SolanaError as SolanaError8,
  transformEncoder as transformEncoder8
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory8,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount3
} from "@solana/program-client-core";
var RESUME_SUBSCRIPTION_DISCRIMINATOR = 13;
function getResumeSubscriptionDiscriminatorBytes() {
  return getU8Encoder13().encode(RESUME_SUBSCRIPTION_DISCRIMINATOR);
}
function getResumeSubscriptionInstructionDataEncoder() {
  return transformEncoder8(getStructEncoder22([["discriminator", getU8Encoder13()]]), (value) => ({
    ...value,
    discriminator: RESUME_SUBSCRIPTION_DISCRIMINATOR
  }));
}
function getResumeSubscriptionInstructionDataDecoder() {
  return getStructDecoder22([["discriminator", getU8Decoder13()]]);
}
function getResumeSubscriptionInstructionDataCodec() {
  return combineCodec24(getResumeSubscriptionInstructionDataEncoder(), getResumeSubscriptionInstructionDataDecoder());
}
async function getResumeSubscriptionInstructionAsync(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.subscriptionPda.value) {
    accounts.subscriptionPda.value = await findSubscriptionDelegationPda({
      planPda: getAddressFromResolvedInstructionAccount3("planPda", accounts.planPda.value),
      subscriber: getAddressFromResolvedInstructionAccount3("subscriber", accounts.subscriber.value)
    });
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getResumeSubscriptionInstructionDataEncoder().encode({}),
    programAddress
  });
}
function getResumeSubscriptionInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory8(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getResumeSubscriptionInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseResumeSubscriptionInstruction(instruction) {
  if (instruction.accounts.length < 5) {
    throw new SolanaError8(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS8, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 5
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      subscriber: getNextAccount(),
      planPda: getNextAccount(),
      subscriptionPda: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getResumeSubscriptionInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/revokeAbandonedDelegation.ts
import {
  combineCodec as combineCodec25,
  getStructDecoder as getStructDecoder23,
  getStructEncoder as getStructEncoder23,
  getU8Decoder as getU8Decoder14,
  getU8Encoder as getU8Encoder14,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9,
  SolanaError as SolanaError9,
  transformEncoder as transformEncoder9
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory9 } from "@solana/program-client-core";
var REVOKE_ABANDONED_DELEGATION_DISCRIMINATOR = 15;
function getRevokeAbandonedDelegationDiscriminatorBytes() {
  return getU8Encoder14().encode(REVOKE_ABANDONED_DELEGATION_DISCRIMINATOR);
}
function getRevokeAbandonedDelegationInstructionDataEncoder() {
  return transformEncoder9(getStructEncoder23([["discriminator", getU8Encoder14()]]), (value) => ({
    ...value,
    discriminator: REVOKE_ABANDONED_DELEGATION_DISCRIMINATOR
  }));
}
function getRevokeAbandonedDelegationInstructionDataDecoder() {
  return getStructDecoder23([["discriminator", getU8Decoder14()]]);
}
function getRevokeAbandonedDelegationInstructionDataCodec() {
  return combineCodec25(
    getRevokeAbandonedDelegationInstructionDataEncoder(),
    getRevokeAbandonedDelegationInstructionDataDecoder()
  );
}
function getRevokeAbandonedDelegationInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    payer: { value: input.payer ?? null, isWritable: true },
    delegationAccount: { value: input.delegationAccount ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const getAccountMeta = getAccountMetaFactory9(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("payer", accounts.payer),
      getAccountMeta("delegationAccount", accounts.delegationAccount),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority)
    ],
    data: getRevokeAbandonedDelegationInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseRevokeAbandonedDelegationInstruction(instruction) {
  if (instruction.accounts.length < 3) {
    throw new SolanaError9(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS9, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 3
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      payer: getNextAccount(),
      delegationAccount: getNextAccount(),
      subscriptionAuthority: getNextAccount()
    },
    data: getRevokeAbandonedDelegationInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/revokeDelegation.ts
import {
  combineCodec as combineCodec26,
  getStructDecoder as getStructDecoder24,
  getStructEncoder as getStructEncoder24,
  getU8Decoder as getU8Decoder15,
  getU8Encoder as getU8Encoder15,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10,
  SolanaError as SolanaError10,
  transformEncoder as transformEncoder10
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory10 } from "@solana/program-client-core";
var REVOKE_DELEGATION_DISCRIMINATOR = 3;
function getRevokeDelegationDiscriminatorBytes() {
  return getU8Encoder15().encode(REVOKE_DELEGATION_DISCRIMINATOR);
}
function getRevokeDelegationInstructionDataEncoder() {
  return transformEncoder10(getStructEncoder24([["discriminator", getU8Encoder15()]]), (value) => ({
    ...value,
    discriminator: REVOKE_DELEGATION_DISCRIMINATOR
  }));
}
function getRevokeDelegationInstructionDataDecoder() {
  return getStructDecoder24([["discriminator", getU8Decoder15()]]);
}
function getRevokeDelegationInstructionDataCodec() {
  return combineCodec26(getRevokeDelegationInstructionDataEncoder(), getRevokeDelegationInstructionDataDecoder());
}
function getRevokeDelegationInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    authority: { value: input.authority ?? null, isWritable: true },
    delegationAccount: { value: input.delegationAccount ?? null, isWritable: true }
  };
  const accounts = originalAccounts;
  const getAccountMeta = getAccountMetaFactory10(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("authority", accounts.authority),
      getAccountMeta("delegationAccount", accounts.delegationAccount)
    ],
    data: getRevokeDelegationInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseRevokeDelegationInstruction(instruction) {
  if (instruction.accounts.length < 2) {
    throw new SolanaError10(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS10, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 2
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: { authority: getNextAccount(), delegationAccount: getNextAccount() },
    data: getRevokeDelegationInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/revokeSubscriptionAuthority.ts
import {
  combineCodec as combineCodec27,
  getStructDecoder as getStructDecoder25,
  getStructEncoder as getStructEncoder25,
  getU8Decoder as getU8Decoder16,
  getU8Encoder as getU8Encoder16,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11,
  SolanaError as SolanaError11,
  transformEncoder as transformEncoder11
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory11 } from "@solana/program-client-core";
var REVOKE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR = 14;
function getRevokeSubscriptionAuthorityDiscriminatorBytes() {
  return getU8Encoder16().encode(REVOKE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR);
}
function getRevokeSubscriptionAuthorityInstructionDataEncoder() {
  return transformEncoder11(getStructEncoder25([["discriminator", getU8Encoder16()]]), (value) => ({
    ...value,
    discriminator: REVOKE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR
  }));
}
function getRevokeSubscriptionAuthorityInstructionDataDecoder() {
  return getStructDecoder25([["discriminator", getU8Decoder16()]]);
}
function getRevokeSubscriptionAuthorityInstructionDataCodec() {
  return combineCodec27(
    getRevokeSubscriptionAuthorityInstructionDataEncoder(),
    getRevokeSubscriptionAuthorityInstructionDataDecoder()
  );
}
function getRevokeSubscriptionAuthorityInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    user: { value: input.user ?? null, isWritable: false },
    userAta: { value: input.userAta ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const getAccountMeta = getAccountMetaFactory11(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("user", accounts.user),
      getAccountMeta("userAta", accounts.userAta),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("tokenProgram", accounts.tokenProgram)
    ],
    data: getRevokeSubscriptionAuthorityInstructionDataEncoder().encode({}),
    programAddress
  });
}
function parseRevokeSubscriptionAuthorityInstruction(instruction) {
  if (instruction.accounts.length < 4) {
    throw new SolanaError11(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS11, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 4
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      user: getNextAccount(),
      userAta: getNextAccount(),
      tokenMint: getNextAccount(),
      tokenProgram: getNextAccount()
    },
    data: getRevokeSubscriptionAuthorityInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/subscribe.ts
import {
  combineCodec as combineCodec28,
  getStructDecoder as getStructDecoder26,
  getStructEncoder as getStructEncoder26,
  getU8Decoder as getU8Decoder17,
  getU8Encoder as getU8Encoder17,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12,
  SolanaError as SolanaError12,
  transformEncoder as transformEncoder12
} from "@solana/kit";
import {
  getAccountMetaFactory as getAccountMetaFactory12,
  getAddressFromResolvedInstructionAccount as getAddressFromResolvedInstructionAccount4
} from "@solana/program-client-core";
var SUBSCRIBE_DISCRIMINATOR = 11;
function getSubscribeDiscriminatorBytes() {
  return getU8Encoder17().encode(SUBSCRIBE_DISCRIMINATOR);
}
function getSubscribeInstructionDataEncoder() {
  return transformEncoder12(
    getStructEncoder26([
      ["discriminator", getU8Encoder17()],
      ["subscribeData", getSubscribeDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: SUBSCRIBE_DISCRIMINATOR })
  );
}
function getSubscribeInstructionDataDecoder() {
  return getStructDecoder26([
    ["discriminator", getU8Decoder17()],
    ["subscribeData", getSubscribeDataDecoder()]
  ]);
}
function getSubscribeInstructionDataCodec() {
  return combineCodec28(getSubscribeInstructionDataEncoder(), getSubscribeInstructionDataDecoder());
}
async function getSubscribeInstructionAsync(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: true },
    merchant: { value: input.merchant ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    subscriptionAuthorityPda: { value: input.subscriptionAuthorityPda ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.subscriptionPda.value) {
    accounts.subscriptionPda.value = await findSubscriptionDelegationPda({
      planPda: getAddressFromResolvedInstructionAccount4("planPda", accounts.planPda.value),
      subscriber: getAddressFromResolvedInstructionAccount4("subscriber", accounts.subscriber.value)
    });
  }
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("merchant", accounts.merchant),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("subscriptionAuthorityPda", accounts.subscriptionAuthorityPda),
      getAccountMeta("systemProgram", accounts.systemProgram),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getSubscribeInstructionDataEncoder().encode(args),
    programAddress
  });
}
function getSubscribeInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriber: { value: input.subscriber ?? null, isWritable: true },
    merchant: { value: input.merchant ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    subscriptionAuthorityPda: { value: input.subscriptionAuthorityPda ?? null, isWritable: false },
    systemProgram: { value: input.systemProgram ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.systemProgram.value) {
    accounts.systemProgram.value = "11111111111111111111111111111111";
  }
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory12(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriber", accounts.subscriber),
      getAccountMeta("merchant", accounts.merchant),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("subscriptionAuthorityPda", accounts.subscriptionAuthorityPda),
      getAccountMeta("systemProgram", accounts.systemProgram),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getSubscribeInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseSubscribeInstruction(instruction) {
  if (instruction.accounts.length < 8) {
    throw new SolanaError12(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS12, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 8
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      subscriber: getNextAccount(),
      merchant: getNextAccount(),
      planPda: getNextAccount(),
      subscriptionPda: getNextAccount(),
      subscriptionAuthorityPda: getNextAccount(),
      systemProgram: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getSubscribeInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/transferFixed.ts
import {
  combineCodec as combineCodec29,
  getStructDecoder as getStructDecoder27,
  getStructEncoder as getStructEncoder27,
  getU8Decoder as getU8Decoder18,
  getU8Encoder as getU8Encoder18,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13,
  SolanaError as SolanaError13,
  transformEncoder as transformEncoder13
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory13 } from "@solana/program-client-core";
var TRANSFER_FIXED_DISCRIMINATOR = 4;
function getTransferFixedDiscriminatorBytes() {
  return getU8Encoder18().encode(TRANSFER_FIXED_DISCRIMINATOR);
}
function getTransferFixedInstructionDataEncoder() {
  return transformEncoder13(
    getStructEncoder27([
      ["discriminator", getU8Encoder18()],
      ["transferData", getTransferDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: TRANSFER_FIXED_DISCRIMINATOR })
  );
}
function getTransferFixedInstructionDataDecoder() {
  return getStructDecoder27([
    ["discriminator", getU8Decoder18()],
    ["transferData", getTransferDataDecoder()]
  ]);
}
function getTransferFixedInstructionDataCodec() {
  return combineCodec29(getTransferFixedInstructionDataEncoder(), getTransferFixedInstructionDataDecoder());
}
function getTransferFixedInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    delegationPda: { value: input.delegationPda ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false },
    delegatorAta: { value: input.delegatorAta ?? null, isWritable: true },
    receiverAta: { value: input.receiverAta ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    delegatee: { value: input.delegatee ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory13(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("delegationPda", accounts.delegationPda),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("delegatorAta", accounts.delegatorAta),
      getAccountMeta("receiverAta", accounts.receiverAta),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("tokenProgram", accounts.tokenProgram),
      getAccountMeta("delegatee", accounts.delegatee),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getTransferFixedInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseTransferFixedInstruction(instruction) {
  if (instruction.accounts.length < 9) {
    throw new SolanaError13(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS13, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 9
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      delegationPda: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      delegatorAta: getNextAccount(),
      receiverAta: getNextAccount(),
      tokenMint: getNextAccount(),
      tokenProgram: getNextAccount(),
      delegatee: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getTransferFixedInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/transferRecurring.ts
import {
  combineCodec as combineCodec30,
  getStructDecoder as getStructDecoder28,
  getStructEncoder as getStructEncoder28,
  getU8Decoder as getU8Decoder19,
  getU8Encoder as getU8Encoder19,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14,
  SolanaError as SolanaError14,
  transformEncoder as transformEncoder14
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory14 } from "@solana/program-client-core";
var TRANSFER_RECURRING_DISCRIMINATOR = 5;
function getTransferRecurringDiscriminatorBytes() {
  return getU8Encoder19().encode(TRANSFER_RECURRING_DISCRIMINATOR);
}
function getTransferRecurringInstructionDataEncoder() {
  return transformEncoder14(
    getStructEncoder28([
      ["discriminator", getU8Encoder19()],
      ["transferData", getTransferDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: TRANSFER_RECURRING_DISCRIMINATOR })
  );
}
function getTransferRecurringInstructionDataDecoder() {
  return getStructDecoder28([
    ["discriminator", getU8Decoder19()],
    ["transferData", getTransferDataDecoder()]
  ]);
}
function getTransferRecurringInstructionDataCodec() {
  return combineCodec30(getTransferRecurringInstructionDataEncoder(), getTransferRecurringInstructionDataDecoder());
}
function getTransferRecurringInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    delegationPda: { value: input.delegationPda ?? null, isWritable: true },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false },
    delegatorAta: { value: input.delegatorAta ?? null, isWritable: true },
    receiverAta: { value: input.receiverAta ?? null, isWritable: true },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    delegatee: { value: input.delegatee ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory14(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("delegationPda", accounts.delegationPda),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("delegatorAta", accounts.delegatorAta),
      getAccountMeta("receiverAta", accounts.receiverAta),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("tokenProgram", accounts.tokenProgram),
      getAccountMeta("delegatee", accounts.delegatee),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getTransferRecurringInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseTransferRecurringInstruction(instruction) {
  if (instruction.accounts.length < 9) {
    throw new SolanaError14(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS14, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 9
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      delegationPda: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      delegatorAta: getNextAccount(),
      receiverAta: getNextAccount(),
      tokenMint: getNextAccount(),
      tokenProgram: getNextAccount(),
      delegatee: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getTransferRecurringInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/transferSubscription.ts
import {
  combineCodec as combineCodec31,
  getStructDecoder as getStructDecoder29,
  getStructEncoder as getStructEncoder29,
  getU8Decoder as getU8Decoder20,
  getU8Encoder as getU8Encoder20,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15,
  SolanaError as SolanaError15,
  transformEncoder as transformEncoder15
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory15 } from "@solana/program-client-core";
var TRANSFER_SUBSCRIPTION_DISCRIMINATOR = 10;
function getTransferSubscriptionDiscriminatorBytes() {
  return getU8Encoder20().encode(TRANSFER_SUBSCRIPTION_DISCRIMINATOR);
}
function getTransferSubscriptionInstructionDataEncoder() {
  return transformEncoder15(
    getStructEncoder29([
      ["discriminator", getU8Encoder20()],
      ["transferData", getTransferDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: TRANSFER_SUBSCRIPTION_DISCRIMINATOR })
  );
}
function getTransferSubscriptionInstructionDataDecoder() {
  return getStructDecoder29([
    ["discriminator", getU8Decoder20()],
    ["transferData", getTransferDataDecoder()]
  ]);
}
function getTransferSubscriptionInstructionDataCodec() {
  return combineCodec31(
    getTransferSubscriptionInstructionDataEncoder(),
    getTransferSubscriptionInstructionDataDecoder()
  );
}
function getTransferSubscriptionInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    subscriptionPda: { value: input.subscriptionPda ?? null, isWritable: true },
    planPda: { value: input.planPda ?? null, isWritable: false },
    subscriptionAuthority: { value: input.subscriptionAuthority ?? null, isWritable: false },
    delegatorAta: { value: input.delegatorAta ?? null, isWritable: true },
    receiverAta: { value: input.receiverAta ?? null, isWritable: true },
    caller: { value: input.caller ?? null, isWritable: false },
    tokenMint: { value: input.tokenMint ?? null, isWritable: false },
    tokenProgram: { value: input.tokenProgram ?? null, isWritable: false },
    eventAuthority: { value: input.eventAuthority ?? null, isWritable: false },
    selfProgram: { value: input.selfProgram ?? null, isWritable: false }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  if (!accounts.eventAuthority.value) {
    accounts.eventAuthority.value = "3Hnj4BYoDgtpBuqXfiy7Y8cNa3jXaNd4oqgSXBzkMcH7";
  }
  if (!accounts.selfProgram.value) {
    accounts.selfProgram.value = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
  }
  const getAccountMeta = getAccountMetaFactory15(programAddress, "programId");
  return Object.freeze({
    accounts: [
      getAccountMeta("subscriptionPda", accounts.subscriptionPda),
      getAccountMeta("planPda", accounts.planPda),
      getAccountMeta("subscriptionAuthority", accounts.subscriptionAuthority),
      getAccountMeta("delegatorAta", accounts.delegatorAta),
      getAccountMeta("receiverAta", accounts.receiverAta),
      getAccountMeta("caller", accounts.caller),
      getAccountMeta("tokenMint", accounts.tokenMint),
      getAccountMeta("tokenProgram", accounts.tokenProgram),
      getAccountMeta("eventAuthority", accounts.eventAuthority),
      getAccountMeta("selfProgram", accounts.selfProgram)
    ],
    data: getTransferSubscriptionInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseTransferSubscriptionInstruction(instruction) {
  if (instruction.accounts.length < 10) {
    throw new SolanaError15(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS15, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 10
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      subscriptionPda: getNextAccount(),
      planPda: getNextAccount(),
      subscriptionAuthority: getNextAccount(),
      delegatorAta: getNextAccount(),
      receiverAta: getNextAccount(),
      caller: getNextAccount(),
      tokenMint: getNextAccount(),
      tokenProgram: getNextAccount(),
      eventAuthority: getNextAccount(),
      selfProgram: getNextAccount()
    },
    data: getTransferSubscriptionInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/instructions/updatePlan.ts
import {
  combineCodec as combineCodec32,
  getStructDecoder as getStructDecoder30,
  getStructEncoder as getStructEncoder30,
  getU8Decoder as getU8Decoder21,
  getU8Encoder as getU8Encoder21,
  SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS as SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16,
  SolanaError as SolanaError16,
  transformEncoder as transformEncoder16
} from "@solana/kit";
import { getAccountMetaFactory as getAccountMetaFactory16 } from "@solana/program-client-core";
var UPDATE_PLAN_DISCRIMINATOR = 8;
function getUpdatePlanDiscriminatorBytes() {
  return getU8Encoder21().encode(UPDATE_PLAN_DISCRIMINATOR);
}
function getUpdatePlanInstructionDataEncoder() {
  return transformEncoder16(
    getStructEncoder30([
      ["discriminator", getU8Encoder21()],
      ["updatePlanData", getUpdatePlanDataEncoder()]
    ]),
    (value) => ({ ...value, discriminator: UPDATE_PLAN_DISCRIMINATOR })
  );
}
function getUpdatePlanInstructionDataDecoder() {
  return getStructDecoder30([
    ["discriminator", getU8Decoder21()],
    ["updatePlanData", getUpdatePlanDataDecoder()]
  ]);
}
function getUpdatePlanInstructionDataCodec() {
  return combineCodec32(getUpdatePlanInstructionDataEncoder(), getUpdatePlanInstructionDataDecoder());
}
function getUpdatePlanInstruction(input, config) {
  const programAddress = config?.programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const originalAccounts = {
    owner: { value: input.owner ?? null, isWritable: false },
    planPda: { value: input.planPda ?? null, isWritable: true }
  };
  const accounts = originalAccounts;
  const args = { ...input };
  const getAccountMeta = getAccountMetaFactory16(programAddress, "programId");
  return Object.freeze({
    accounts: [getAccountMeta("owner", accounts.owner), getAccountMeta("planPda", accounts.planPda)],
    data: getUpdatePlanInstructionDataEncoder().encode(args),
    programAddress
  });
}
function parseUpdatePlanInstruction(instruction) {
  if (instruction.accounts.length < 2) {
    throw new SolanaError16(SOLANA_ERROR__PROGRAM_CLIENTS__INSUFFICIENT_ACCOUNT_METAS16, {
      actualAccountMetas: instruction.accounts.length,
      expectedAccountMetas: 2
    });
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts[accountIndex];
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: { owner: getNextAccount(), planPda: getNextAccount() },
    data: getUpdatePlanInstructionDataDecoder().decode(instruction.data)
  };
}

// src/generated/programs/subscriptions.ts
var SUBSCRIPTIONS_PROGRAM_ADDRESS = "De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44";
var SubscriptionsAccount = /* @__PURE__ */ ((SubscriptionsAccount2) => {
  SubscriptionsAccount2[SubscriptionsAccount2["FixedDelegation"] = 0] = "FixedDelegation";
  SubscriptionsAccount2[SubscriptionsAccount2["Plan"] = 1] = "Plan";
  SubscriptionsAccount2[SubscriptionsAccount2["RecurringDelegation"] = 2] = "RecurringDelegation";
  SubscriptionsAccount2[SubscriptionsAccount2["SubscriptionAuthority"] = 3] = "SubscriptionAuthority";
  SubscriptionsAccount2[SubscriptionsAccount2["SubscriptionDelegation"] = 4] = "SubscriptionDelegation";
  SubscriptionsAccount2[SubscriptionsAccount2["EventAuthority"] = 5] = "EventAuthority";
  return SubscriptionsAccount2;
})(SubscriptionsAccount || {});
var SubscriptionsInstruction = /* @__PURE__ */ ((SubscriptionsInstruction2) => {
  SubscriptionsInstruction2[SubscriptionsInstruction2["InitSubscriptionAuthority"] = 0] = "InitSubscriptionAuthority";
  SubscriptionsInstruction2[SubscriptionsInstruction2["CreateFixedDelegation"] = 1] = "CreateFixedDelegation";
  SubscriptionsInstruction2[SubscriptionsInstruction2["CreateRecurringDelegation"] = 2] = "CreateRecurringDelegation";
  SubscriptionsInstruction2[SubscriptionsInstruction2["RevokeDelegation"] = 3] = "RevokeDelegation";
  SubscriptionsInstruction2[SubscriptionsInstruction2["TransferFixed"] = 4] = "TransferFixed";
  SubscriptionsInstruction2[SubscriptionsInstruction2["TransferRecurring"] = 5] = "TransferRecurring";
  SubscriptionsInstruction2[SubscriptionsInstruction2["CloseSubscriptionAuthority"] = 6] = "CloseSubscriptionAuthority";
  SubscriptionsInstruction2[SubscriptionsInstruction2["CreatePlan"] = 7] = "CreatePlan";
  SubscriptionsInstruction2[SubscriptionsInstruction2["UpdatePlan"] = 8] = "UpdatePlan";
  SubscriptionsInstruction2[SubscriptionsInstruction2["DeletePlan"] = 9] = "DeletePlan";
  SubscriptionsInstruction2[SubscriptionsInstruction2["TransferSubscription"] = 10] = "TransferSubscription";
  SubscriptionsInstruction2[SubscriptionsInstruction2["Subscribe"] = 11] = "Subscribe";
  SubscriptionsInstruction2[SubscriptionsInstruction2["CancelSubscription"] = 12] = "CancelSubscription";
  SubscriptionsInstruction2[SubscriptionsInstruction2["ResumeSubscription"] = 13] = "ResumeSubscription";
  SubscriptionsInstruction2[SubscriptionsInstruction2["RevokeSubscriptionAuthority"] = 14] = "RevokeSubscriptionAuthority";
  SubscriptionsInstruction2[SubscriptionsInstruction2["RevokeAbandonedDelegation"] = 15] = "RevokeAbandonedDelegation";
  return SubscriptionsInstruction2;
})(SubscriptionsInstruction || {});
function identifySubscriptionsInstruction(instruction) {
  const data = "data" in instruction ? instruction.data : instruction;
  if (containsBytes(data, getU8Encoder22().encode(0), 0)) {
    return 0 /* InitSubscriptionAuthority */;
  }
  if (containsBytes(data, getU8Encoder22().encode(1), 0)) {
    return 1 /* CreateFixedDelegation */;
  }
  if (containsBytes(data, getU8Encoder22().encode(2), 0)) {
    return 2 /* CreateRecurringDelegation */;
  }
  if (containsBytes(data, getU8Encoder22().encode(3), 0)) {
    return 3 /* RevokeDelegation */;
  }
  if (containsBytes(data, getU8Encoder22().encode(4), 0)) {
    return 4 /* TransferFixed */;
  }
  if (containsBytes(data, getU8Encoder22().encode(5), 0)) {
    return 5 /* TransferRecurring */;
  }
  if (containsBytes(data, getU8Encoder22().encode(6), 0)) {
    return 6 /* CloseSubscriptionAuthority */;
  }
  if (containsBytes(data, getU8Encoder22().encode(7), 0)) {
    return 7 /* CreatePlan */;
  }
  if (containsBytes(data, getU8Encoder22().encode(8), 0)) {
    return 8 /* UpdatePlan */;
  }
  if (containsBytes(data, getU8Encoder22().encode(9), 0)) {
    return 9 /* DeletePlan */;
  }
  if (containsBytes(data, getU8Encoder22().encode(10), 0)) {
    return 10 /* TransferSubscription */;
  }
  if (containsBytes(data, getU8Encoder22().encode(11), 0)) {
    return 11 /* Subscribe */;
  }
  if (containsBytes(data, getU8Encoder22().encode(12), 0)) {
    return 12 /* CancelSubscription */;
  }
  if (containsBytes(data, getU8Encoder22().encode(13), 0)) {
    return 13 /* ResumeSubscription */;
  }
  if (containsBytes(data, getU8Encoder22().encode(14), 0)) {
    return 14 /* RevokeSubscriptionAuthority */;
  }
  if (containsBytes(data, getU8Encoder22().encode(15), 0)) {
    return 15 /* RevokeAbandonedDelegation */;
  }
  throw new SolanaError17(SOLANA_ERROR__PROGRAM_CLIENTS__FAILED_TO_IDENTIFY_INSTRUCTION, {
    instructionData: data,
    programName: "subscriptions"
  });
}
function parseSubscriptionsInstruction(instruction) {
  const instructionType = identifySubscriptionsInstruction(instruction);
  switch (instructionType) {
    case 0 /* InitSubscriptionAuthority */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 0 /* InitSubscriptionAuthority */,
        ...parseInitSubscriptionAuthorityInstruction(instruction)
      };
    }
    case 1 /* CreateFixedDelegation */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 1 /* CreateFixedDelegation */,
        ...parseCreateFixedDelegationInstruction(instruction)
      };
    }
    case 2 /* CreateRecurringDelegation */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 2 /* CreateRecurringDelegation */,
        ...parseCreateRecurringDelegationInstruction(instruction)
      };
    }
    case 3 /* RevokeDelegation */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 3 /* RevokeDelegation */,
        ...parseRevokeDelegationInstruction(instruction)
      };
    }
    case 4 /* TransferFixed */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 4 /* TransferFixed */,
        ...parseTransferFixedInstruction(instruction)
      };
    }
    case 5 /* TransferRecurring */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 5 /* TransferRecurring */,
        ...parseTransferRecurringInstruction(instruction)
      };
    }
    case 6 /* CloseSubscriptionAuthority */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 6 /* CloseSubscriptionAuthority */,
        ...parseCloseSubscriptionAuthorityInstruction(instruction)
      };
    }
    case 7 /* CreatePlan */: {
      assertIsInstructionWithAccounts(instruction);
      return { instructionType: 7 /* CreatePlan */, ...parseCreatePlanInstruction(instruction) };
    }
    case 8 /* UpdatePlan */: {
      assertIsInstructionWithAccounts(instruction);
      return { instructionType: 8 /* UpdatePlan */, ...parseUpdatePlanInstruction(instruction) };
    }
    case 9 /* DeletePlan */: {
      assertIsInstructionWithAccounts(instruction);
      return { instructionType: 9 /* DeletePlan */, ...parseDeletePlanInstruction(instruction) };
    }
    case 10 /* TransferSubscription */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 10 /* TransferSubscription */,
        ...parseTransferSubscriptionInstruction(instruction)
      };
    }
    case 11 /* Subscribe */: {
      assertIsInstructionWithAccounts(instruction);
      return { instructionType: 11 /* Subscribe */, ...parseSubscribeInstruction(instruction) };
    }
    case 12 /* CancelSubscription */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 12 /* CancelSubscription */,
        ...parseCancelSubscriptionInstruction(instruction)
      };
    }
    case 13 /* ResumeSubscription */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 13 /* ResumeSubscription */,
        ...parseResumeSubscriptionInstruction(instruction)
      };
    }
    case 14 /* RevokeSubscriptionAuthority */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 14 /* RevokeSubscriptionAuthority */,
        ...parseRevokeSubscriptionAuthorityInstruction(instruction)
      };
    }
    case 15 /* RevokeAbandonedDelegation */: {
      assertIsInstructionWithAccounts(instruction);
      return {
        instructionType: 15 /* RevokeAbandonedDelegation */,
        ...parseRevokeAbandonedDelegationInstruction(instruction)
      };
    }
    default:
      throw new SolanaError17(SOLANA_ERROR__PROGRAM_CLIENTS__UNRECOGNIZED_INSTRUCTION_TYPE, {
        instructionType,
        programName: "subscriptions"
      });
  }
}
function subscriptionsProgram() {
  return (client) => {
    return extendClient(client, {
      subscriptions: {
        accounts: {
          fixedDelegation: addSelfFetchFunctions(client, getFixedDelegationCodec()),
          plan: addSelfFetchFunctions(client, getPlanCodec()),
          recurringDelegation: addSelfFetchFunctions(client, getRecurringDelegationCodec()),
          subscriptionAuthority: addSelfFetchFunctions(client, getSubscriptionAuthorityCodec()),
          subscriptionDelegation: addSelfFetchFunctions(client, getSubscriptionDelegationCodec()),
          eventAuthority: addSelfFetchFunctions(client, getEventAuthorityCodec())
        },
        instructions: {
          initSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions(client, getInitSubscriptionAuthorityInstructionAsync(input)),
          createFixedDelegation: (input) => addSelfPlanAndSendFunctions(client, getCreateFixedDelegationInstruction(input)),
          createRecurringDelegation: (input) => addSelfPlanAndSendFunctions(client, getCreateRecurringDelegationInstruction(input)),
          revokeDelegation: (input) => addSelfPlanAndSendFunctions(client, getRevokeDelegationInstruction(input)),
          transferFixed: (input) => addSelfPlanAndSendFunctions(client, getTransferFixedInstruction(input)),
          transferRecurring: (input) => addSelfPlanAndSendFunctions(client, getTransferRecurringInstruction(input)),
          closeSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions(client, getCloseSubscriptionAuthorityInstruction(input)),
          createPlan: (input) => addSelfPlanAndSendFunctions(client, getCreatePlanInstruction(input)),
          updatePlan: (input) => addSelfPlanAndSendFunctions(client, getUpdatePlanInstruction(input)),
          deletePlan: (input) => addSelfPlanAndSendFunctions(client, getDeletePlanInstruction(input)),
          transferSubscription: (input) => addSelfPlanAndSendFunctions(client, getTransferSubscriptionInstruction(input)),
          subscribe: (input) => addSelfPlanAndSendFunctions(client, getSubscribeInstructionAsync(input)),
          cancelSubscription: (input) => addSelfPlanAndSendFunctions(client, getCancelSubscriptionInstructionAsync(input)),
          resumeSubscription: (input) => addSelfPlanAndSendFunctions(client, getResumeSubscriptionInstructionAsync(input)),
          revokeSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions(client, getRevokeSubscriptionAuthorityInstruction(input)),
          revokeAbandonedDelegation: (input) => addSelfPlanAndSendFunctions(client, getRevokeAbandonedDelegationInstruction(input))
        },
        pdas: {
          fixedDelegation: findFixedDelegationPda,
          plan: findPlanPda,
          recurringDelegation: findRecurringDelegationPda,
          subscriptionAuthority: findSubscriptionAuthorityPda,
          subscriptionDelegation: findSubscriptionDelegationPda,
          eventAuthority: findEventAuthorityPda
        }
      }
    });
  };
}

// src/generated/errors/subscriptions.ts
var SUBSCRIPTIONS_ERROR__NOT_SIGNER = 100;
var SUBSCRIPTIONS_ERROR__INVALID_ADDRESS = 101;
var SUBSCRIPTIONS_ERROR__INVALID_ESCROW_PDA = 102;
var SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_AUTHORITY_PDA = 103;
var SUBSCRIPTIONS_ERROR__NOT_SYSTEM_PROGRAM = 104;
var SUBSCRIPTIONS_ERROR__INVALID_TOKEN_PROGRAM = 105;
var SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_MINT_ACCOUNT_DATA = 106;
var SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_TOKEN_ACCOUNT_DATA = 107;
var SUBSCRIPTIONS_ERROR__INVALID_ASSOCIATED_TOKEN_ACCOUNT_DERIVED_ADDRESS = 108;
var SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_MINT_ACCOUNT_DATA = 109;
var SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_TOKEN_ACCOUNT_DATA = 110;
var SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DATA = 111;
var SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION_DATA = 112;
var SUBSCRIPTIONS_ERROR__NOT_ENOUGH_ACCOUNT_KEYS = 113;
var SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION = 114;
var SUBSCRIPTIONS_ERROR__ARITHMETIC_OVERFLOW = 115;
var SUBSCRIPTIONS_ERROR__ARITHMETIC_UNDERFLOW = 116;
var SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DISCRIMINATOR = 117;
var SUBSCRIPTIONS_ERROR__MINT_HAS_CONFIDENTIAL_TRANSFER = 118;
var SUBSCRIPTIONS_ERROR__MINT_HAS_NON_TRANSFERABLE = 119;
var SUBSCRIPTIONS_ERROR__MINT_HAS_PERMANENT_DELEGATE = 120;
var SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_HOOK = 121;
var SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_FEE = 122;
var SUBSCRIPTIONS_ERROR__MINT_HAS_MINT_CLOSE_AUTHORITY = 123;
var SUBSCRIPTIONS_ERROR__MINT_HAS_PAUSABLE = 124;
var SUBSCRIPTIONS_ERROR__MINT_MISMATCH = 125;
var SUBSCRIPTIONS_ERROR__INVALID_DELEGATE_PDA = 126;
var SUBSCRIPTIONS_ERROR__INVALID_HEADER_DATA = 127;
var SUBSCRIPTIONS_ERROR__DELEGATION_EXPIRED = 128;
var SUBSCRIPTIONS_ERROR__INVALID_AMOUNT = 129;
var SUBSCRIPTIONS_ERROR__UNAUTHORIZED = 130;
var SUBSCRIPTIONS_ERROR__ACCOUNT_NOT_WRITABLE = 131;
var SUBSCRIPTIONS_ERROR__ATA_OWNER_MISMATCH = 132;
var SUBSCRIPTIONS_ERROR__DELEGATION_VERSION_MISMATCH = 133;
var SUBSCRIPTIONS_ERROR__MIGRATION_REQUIRED = 134;
var SUBSCRIPTIONS_ERROR__DELEGATION_ALREADY_EXISTS = 135;
var SUBSCRIPTIONS_ERROR__STALE_SUBSCRIPTION_AUTHORITY = 136;
var SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_TOO_MANY_ACCOUNTS = 137;
var SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_VALIDATION_ACCOUNT_MISSING = 138;
var SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_LIMIT = 300;
var SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_EXPIRY_IN_PAST = 301;
var SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_AMOUNT_ZERO = 302;
var SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_PERIOD_LIMIT = 400;
var SUBSCRIPTIONS_ERROR__PERIOD_NOT_ELAPSED = 401;
var SUBSCRIPTIONS_ERROR__INVALID_PERIOD_LENGTH = 402;
var SUBSCRIPTIONS_ERROR__INVALID_PAYER_DATA = 403;
var SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_IN_PAST = 404;
var SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_GREATER_THAN_EXPIRY = 405;
var SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_AMOUNT_ZERO = 406;
var SUBSCRIPTIONS_ERROR__DELEGATION_NOT_STARTED = 407;
var SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_ON_LANDING_REQUIRES_EXPIRY = 408;
var SUBSCRIPTIONS_ERROR__PLAN_SUNSET = 500;
var SUBSCRIPTIONS_ERROR__PLAN_EXPIRED = 501;
var SUBSCRIPTIONS_ERROR__INVALID_PLAN_PDA = 502;
var SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_PDA = 503;
var SUBSCRIPTIONS_ERROR__NOT_PLAN_OWNER = 504;
var SUBSCRIPTIONS_ERROR__SUBSCRIPTION_PLAN_MISMATCH = 505;
var SUBSCRIPTIONS_ERROR__UNAUTHORIZED_DESTINATION = 506;
var SUBSCRIPTIONS_ERROR__INVALID_NUM_DESTINATIONS = 507;
var SUBSCRIPTIONS_ERROR__SUBSCRIPTION_CANCELLED = 508;
var SUBSCRIPTIONS_ERROR__SUBSCRIPTION_ALREADY_CANCELLED = 509;
var SUBSCRIPTIONS_ERROR__SUBSCRIPTION_NOT_CANCELLED = 510;
var SUBSCRIPTIONS_ERROR__INVALID_END_TS = 511;
var SUBSCRIPTIONS_ERROR__INVALID_PLAN_STATUS = 512;
var SUBSCRIPTIONS_ERROR__PLAN_IMMUTABLE_AFTER_SUNSET = 513;
var SUBSCRIPTIONS_ERROR__SUNSET_REQUIRES_END_TS = 514;
var SUBSCRIPTIONS_ERROR__PLAN_NOT_EXPIRED = 515;
var SUBSCRIPTIONS_ERROR__PLAN_CLOSED = 516;
var SUBSCRIPTIONS_ERROR__ALREADY_SUBSCRIBED = 517;
var SUBSCRIPTIONS_ERROR__PLAN_ALREADY_EXISTS = 518;
var SUBSCRIPTIONS_ERROR__PLAN_TERMS_MISMATCH = 519;
var SUBSCRIPTIONS_ERROR__INVALID_EVENT_AUTHORITY = 600;
var SUBSCRIPTIONS_ERROR__INVALID_EVENT_DATA = 601;
var SUBSCRIPTIONS_ERROR__INVALID_EVENT_TAG = 602;
var SUBSCRIPTIONS_ERROR__INVALID_EVENT_DISCRIMINATOR = 603;
var subscriptionsErrorMessages;
if (process.env["NODE_ENV"] !== "production") {
  subscriptionsErrorMessages = {
    [SUBSCRIPTIONS_ERROR__ACCOUNT_NOT_WRITABLE]: `Account must be writable`,
    [SUBSCRIPTIONS_ERROR__ALREADY_SUBSCRIBED]: `Already subscribed to this plan`,
    [SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_LIMIT]: `Transfer amount exceeds delegation limit`,
    [SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_PERIOD_LIMIT]: `Transfer amount exceeds period limit`,
    [SUBSCRIPTIONS_ERROR__ARITHMETIC_OVERFLOW]: `Arithmetic Overflow`,
    [SUBSCRIPTIONS_ERROR__ARITHMETIC_UNDERFLOW]: `Arithmetic Underflow`,
    [SUBSCRIPTIONS_ERROR__ATA_OWNER_MISMATCH]: `Token account owner does not match expected`,
    [SUBSCRIPTIONS_ERROR__DELEGATION_ALREADY_EXISTS]: `Delegation account already exists`,
    [SUBSCRIPTIONS_ERROR__DELEGATION_EXPIRED]: `Delegation has expired`,
    [SUBSCRIPTIONS_ERROR__DELEGATION_NOT_STARTED]: `Delegation period has not started yet`,
    [SUBSCRIPTIONS_ERROR__DELEGATION_VERSION_MISMATCH]: `Delegation header version is not compatible`,
    [SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_AMOUNT_ZERO]: `zero amount specified`,
    [SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_EXPIRY_IN_PAST]: `Expiry time specified is less than current time`,
    [SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DATA]: `Invalid account data`,
    [SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DISCRIMINATOR]: `Invalid account discriminator`,
    [SUBSCRIPTIONS_ERROR__INVALID_ADDRESS]: `Invalid account address`,
    [SUBSCRIPTIONS_ERROR__INVALID_AMOUNT]: `Invalid amount specified`,
    [SUBSCRIPTIONS_ERROR__INVALID_ASSOCIATED_TOKEN_ACCOUNT_DERIVED_ADDRESS]: `Invalid associated token account address`,
    [SUBSCRIPTIONS_ERROR__INVALID_DELEGATE_PDA]: `Invalid delegation PDA derivation`,
    [SUBSCRIPTIONS_ERROR__INVALID_END_TS]: `End timestamp must be zero or in the future`,
    [SUBSCRIPTIONS_ERROR__INVALID_ESCROW_PDA]: `Invalid escrow PDA derivation`,
    [SUBSCRIPTIONS_ERROR__INVALID_EVENT_AUTHORITY]: `Invalid event authority PDA`,
    [SUBSCRIPTIONS_ERROR__INVALID_EVENT_DATA]: `Invalid event data`,
    [SUBSCRIPTIONS_ERROR__INVALID_EVENT_DISCRIMINATOR]: `Unknown event discriminator`,
    [SUBSCRIPTIONS_ERROR__INVALID_EVENT_TAG]: `Invalid event tag prefix`,
    [SUBSCRIPTIONS_ERROR__INVALID_HEADER_DATA]: `Invalid header data`,
    [SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION]: `Invalid instruction`,
    [SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION_DATA]: `Invalid instruction data`,
    [SUBSCRIPTIONS_ERROR__INVALID_NUM_DESTINATIONS]: `No valid destinations provided`,
    [SUBSCRIPTIONS_ERROR__INVALID_PAYER_DATA]: `Payer provided does not match delegation`,
    [SUBSCRIPTIONS_ERROR__INVALID_PERIOD_LENGTH]: `Invalid Period length`,
    [SUBSCRIPTIONS_ERROR__INVALID_PLAN_PDA]: `Invalid Plan PDA derivation`,
    [SUBSCRIPTIONS_ERROR__INVALID_PLAN_STATUS]: `Invalid plan status value`,
    [SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_AUTHORITY_PDA]: `Invalid subscription-authority PDA derivation`,
    [SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_PDA]: `Invalid subscription PDA derivation`,
    [SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_MINT_ACCOUNT_DATA]: `Invalid Token-2022 mint account data`,
    [SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_TOKEN_ACCOUNT_DATA]: `Invalid Token-2022 token account data`,
    [SUBSCRIPTIONS_ERROR__INVALID_TOKEN_PROGRAM]: `Token Program does not match other accounts`,
    [SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_MINT_ACCOUNT_DATA]: `Invalid SPL Token mint account data`,
    [SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_TOKEN_ACCOUNT_DATA]: `Invalid SPL Token account data`,
    [SUBSCRIPTIONS_ERROR__MIGRATION_REQUIRED]: `Account requires explicit migration`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_CONFIDENTIAL_TRANSFER]: `Mint has ConfidentialTransfer extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_MINT_CLOSE_AUTHORITY]: `Mint has MintCloseAuthority extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_NON_TRANSFERABLE]: `Mint has NonTransferable extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_PAUSABLE]: `Mint has Pausable extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_PERMANENT_DELEGATE]: `Mint has PermanentDelegate extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_FEE]: `Mint has TransferFee extension`,
    [SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_HOOK]: `Mint has TransferHook extension`,
    [SUBSCRIPTIONS_ERROR__MINT_MISMATCH]: `Token mint mismatch`,
    [SUBSCRIPTIONS_ERROR__NOT_ENOUGH_ACCOUNT_KEYS]: `Not enough account keys provided`,
    [SUBSCRIPTIONS_ERROR__NOT_PLAN_OWNER]: `Caller is not the plan owner`,
    [SUBSCRIPTIONS_ERROR__NOT_SIGNER]: `Account must be a signer`,
    [SUBSCRIPTIONS_ERROR__NOT_SYSTEM_PROGRAM]: `Expected system program`,
    [SUBSCRIPTIONS_ERROR__PERIOD_NOT_ELAPSED]: `Period has not elapsed yet`,
    [SUBSCRIPTIONS_ERROR__PLAN_ALREADY_EXISTS]: `Plan account already exists`,
    [SUBSCRIPTIONS_ERROR__PLAN_CLOSED]: `Plan account has been closed`,
    [SUBSCRIPTIONS_ERROR__PLAN_EXPIRED]: `Plan has expired`,
    [SUBSCRIPTIONS_ERROR__PLAN_IMMUTABLE_AFTER_SUNSET]: `Plan cannot be updated after sunset`,
    [SUBSCRIPTIONS_ERROR__PLAN_NOT_EXPIRED]: `Plan must be expired to delete`,
    [SUBSCRIPTIONS_ERROR__PLAN_SUNSET]: `Plan is in sunset status`,
    [SUBSCRIPTIONS_ERROR__PLAN_TERMS_MISMATCH]: `Subscription plan terms do not match the current plan`,
    [SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_AMOUNT_ZERO]: `zero amount specified`,
    [SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_ON_LANDING_REQUIRES_EXPIRY]: `start_ts of 0 (start on landing) requires a non-zero expiry`,
    [SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_GREATER_THAN_EXPIRY]: `start time specified is greater than expiry`,
    [SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_IN_PAST]: `Past start time specified`,
    [SUBSCRIPTIONS_ERROR__STALE_SUBSCRIPTION_AUTHORITY]: `Delegation init_id does not match current SubscriptionAuthority`,
    [SUBSCRIPTIONS_ERROR__SUBSCRIPTION_ALREADY_CANCELLED]: `Subscription already cancelled`,
    [SUBSCRIPTIONS_ERROR__SUBSCRIPTION_CANCELLED]: `Subscription cancelled and past valid period`,
    [SUBSCRIPTIONS_ERROR__SUBSCRIPTION_NOT_CANCELLED]: `Subscription is not cancelled`,
    [SUBSCRIPTIONS_ERROR__SUBSCRIPTION_PLAN_MISMATCH]: `Subscription does not belong to this plan`,
    [SUBSCRIPTIONS_ERROR__SUNSET_REQUIRES_END_TS]: `Sunset requires a non-zero end timestamp`,
    [SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_TOO_MANY_ACCOUNTS]: `Too many transfer hook accounts provided`,
    [SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_VALIDATION_ACCOUNT_MISSING]: `Transfer hook validation account missing from provided accounts`,
    [SUBSCRIPTIONS_ERROR__UNAUTHORIZED]: `Caller not authorized for this action`,
    [SUBSCRIPTIONS_ERROR__UNAUTHORIZED_DESTINATION]: `Destination not in plan whitelist`
  };
}
function getSubscriptionsErrorMessage(code) {
  if (process.env["NODE_ENV"] !== "production") {
    return subscriptionsErrorMessages[code];
  }
  return "Error message not available in production bundles.";
}
function isSubscriptionsError(error, transactionMessage, code) {
  return isProgramError(error, transactionMessage, SUBSCRIPTIONS_PROGRAM_ADDRESS, code);
}

// src/constants.ts
var PROGRAM_ID = SUBSCRIPTIONS_PROGRAM_ADDRESS;
var CURRENT_PROGRAM_VERSION = 1;
var ZERO_ADDRESS = "11111111111111111111111111111111";
var DISCRIMINATOR_OFFSET = 0;
var DELEGATOR_OFFSET = 3;
var DELEGATEE_OFFSET = 35;
var U64_BYTE_SIZE = 8;
var SUBSCRIPTION_AUTHORITY_SEED = "SubscriptionAuthority";
var DELEGATION_SEED = "delegation";
var PLAN_SEED = "plan";
var SUBSCRIPTION_SEED = "subscription";
var EVENT_AUTHORITY_SEED = "event_authority";
var PLAN_SIZE = 491;
var SUBSCRIPTION_SIZE = 155;
var PLAN_OWNER_OFFSET = 1;
var MAX_PLAN_DESTINATIONS = 4;
var MAX_PLAN_PULLERS = 4;
var METADATA_URI_LEN = 128;

// src/accounts/decode.ts
function toEncodedAccount(raw, programAddress) {
  const base64Encoder = getBase64Encoder();
  const data = base64Encoder.encode(raw.account.data[0]);
  return {
    address: raw.pubkey,
    data,
    executable: raw.account.executable,
    lamports: raw.account.lamports,
    programAddress,
    space: raw.account.space
  };
}
function decodeDelegationAccount(raw, programAddress) {
  const encoded = toEncodedAccount(raw, programAddress);
  const kind = encoded.data[DISCRIMINATOR_OFFSET];
  switch (kind) {
    case 2 /* FixedDelegation */: {
      const decoded = decodeFixedDelegation(encoded);
      return {
        address: raw.pubkey,
        data: decoded.data,
        kind: "fixed"
      };
    }
    case 3 /* RecurringDelegation */: {
      const decoded = decodeRecurringDelegation(encoded);
      return {
        address: raw.pubkey,
        data: decoded.data,
        kind: "recurring"
      };
    }
    case 4 /* SubscriptionDelegation */: {
      const decoded = decodeSubscriptionDelegation(encoded);
      return {
        address: raw.pubkey,
        data: decoded.data,
        kind: "subscription"
      };
    }
    default:
      console.warn(`Unknown delegation discriminator: ${kind}`);
      return null;
  }
}

// src/accounts/delegations.ts
async function fetchDelegationsByDelegator(rpc, wallet, programAddress) {
  return await fetchDelegationsByOffset(rpc, wallet, DELEGATOR_OFFSET, programAddress);
}
async function fetchDelegationsByDelegatee(rpc, wallet, programAddress) {
  return await fetchDelegationsByOffset(rpc, wallet, DELEGATEE_OFFSET, programAddress);
}
async function fetchDelegationsByOffset(rpc, wallet, offset, programAddress) {
  const progAddr = programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const response = await rpc.getProgramAccounts(progAddr, {
    encoding: "base64",
    filters: [
      {
        memcmp: {
          bytes: wallet,
          encoding: "base58",
          offset: BigInt(offset)
        }
      }
    ]
  }).send();
  return response.map((account) => decodeDelegationAccount(account, progAddr)).filter((d) => d !== null);
}

// src/accounts/plans.ts
async function fetchPlansForOwner(rpc, owner, programAddress) {
  const progAddr = programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const response = await rpc.getProgramAccounts(progAddr, {
    encoding: "base64",
    filters: [
      { dataSize: BigInt(PLAN_SIZE) },
      {
        memcmp: {
          bytes: owner,
          encoding: "base58",
          offset: BigInt(PLAN_OWNER_OFFSET)
        }
      }
    ]
  }).send();
  return response.map((account) => {
    const encoded = toEncodedAccount(account, progAddr);
    const { address, data } = decodePlan(encoded);
    return { address, data };
  });
}

// src/accounts/subscriptions.ts
async function fetchSubscriptionsForUser(rpc, user, programAddress) {
  const progAddr = programAddress ?? SUBSCRIPTIONS_PROGRAM_ADDRESS;
  const response = await rpc.getProgramAccounts(progAddr, {
    encoding: "base64",
    filters: [
      { dataSize: BigInt(SUBSCRIPTION_SIZE) },
      {
        memcmp: {
          bytes: user,
          encoding: "base58",
          offset: BigInt(DELEGATOR_OFFSET)
        }
      }
    ]
  }).send();
  return response.map((account) => {
    const raw = account;
    const encoded = toEncodedAccount(raw, progAddr);
    const decoded = decodeSubscriptionDelegation(encoded);
    return { address: raw.pubkey, data: decoded.data };
  });
}

// src/plugin.ts
import {
  AccountRole as AccountRole2,
  pipe
} from "@solana/kit";
import { addSelfPlanAndSendFunctions as addSelfPlanAndSendFunctions2 } from "@solana/program-client-core";
import { findAssociatedTokenPda } from "@solana-program/token";

// src/transfer-hook.ts
import {
  AccountRole,
  fetchEncodedAccount as fetchEncodedAccount7,
  getAddressDecoder as getAddressDecoder10,
  getAddressEncoder as getAddressEncoder15,
  getProgramDerivedAddress as getProgramDerivedAddress7
} from "@solana/kit";
import { fetchMint, TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
var DEFAULT_ADDRESS = "11111111111111111111111111111111";
var EXTRA_ACCOUNT_METAS_SEED = "extra-account-metas";
var TLV_HEADER_LEN = 12;
var POD_SLICE_COUNT_LEN = 4;
var EXTRA_ACCOUNT_META_LEN = 35;
var PUBKEY_LEN = 32;
var PDA_PROGRAM_INDEX_OFFSET = 1 << 7;
var EXECUTE_DISCRIMINATOR = Uint8Array.from([105, 37, 101, 197, 75, 251, 102, 26]);
var addressDecoder = getAddressDecoder10();
var addressEncoder = getAddressEncoder15();
function roleFor(isSigner, isWritable) {
  if (isSigner && isWritable) return AccountRole.WRITABLE_SIGNER;
  if (isSigner) return AccountRole.READONLY_SIGNER;
  if (isWritable) return AccountRole.WRITABLE;
  return AccountRole.READONLY;
}
async function fetchData(rpc, address) {
  const account = await fetchEncodedAccount7(rpc, address);
  if (!account.exists) throw new Error("transfer hook: referenced account not found");
  return account.data;
}
function executeInstructionData(amount) {
  const data = new Uint8Array(EXECUTE_DISCRIMINATOR.length + 8);
  data.set(EXECUTE_DISCRIMINATOR, 0);
  new DataView(data.buffer).setBigUint64(EXECUTE_DISCRIMINATOR.length, BigInt(amount), true);
  return data;
}
function readMetas(data) {
  if (data.length < TLV_HEADER_LEN || !EXECUTE_DISCRIMINATOR.every((byte, i) => data[i] === byte)) {
    return [];
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const count = view.getUint32(TLV_HEADER_LEN, true);
  const metas = [];
  let offset = TLV_HEADER_LEN + POD_SLICE_COUNT_LEN;
  for (let n = 0; n < count && offset + EXTRA_ACCOUNT_META_LEN <= data.length; n++) {
    metas.push({
      addressConfig: data.subarray(offset + 1, offset + 33),
      discriminator: data[offset],
      isSigner: data[offset + 33] === 1,
      isWritable: data[offset + 34] === 1
    });
    offset += EXTRA_ACCOUNT_META_LEN;
  }
  return metas;
}
async function unpackSeeds(config, previous, instructionData, rpc) {
  const seeds = [];
  let i = 0;
  while (i < 32) {
    const discriminator = config[i];
    const rest = config.subarray(i + 1);
    if (discriminator === 0) break;
    if (discriminator === 1) {
      const length = rest[0];
      seeds.push(rest.subarray(1, 1 + length));
      i += 2 + length;
    } else if (discriminator === 2) {
      const [index, length] = [rest[0], rest[1]];
      seeds.push(instructionData.subarray(index, index + length));
      i += 3;
    } else if (discriminator === 3) {
      seeds.push(addressEncoder.encode(previous[rest[0]].address));
      i += 2;
    } else if (discriminator === 4) {
      const [accountIndex, dataIndex, length] = [rest[0], rest[1], rest[2]];
      const data = await fetchData(rpc, previous[accountIndex].address);
      seeds.push(data.subarray(dataIndex, dataIndex + length));
      i += 4;
    } else {
      throw new Error("transfer hook: invalid seed");
    }
  }
  return seeds;
}
async function unpackPubkeyData(config, previous, instructionData, rpc) {
  const rest = config.subarray(1);
  if (config[0] === 1) {
    const offset = rest[0];
    return addressDecoder.decode(instructionData.subarray(offset, offset + PUBKEY_LEN));
  }
  if (config[0] === 2) {
    const [accountIndex, offset] = [rest[0], rest[1]];
    const data = await fetchData(rpc, previous[accountIndex].address);
    return addressDecoder.decode(data.subarray(offset, offset + PUBKEY_LEN));
  }
  throw new Error("transfer hook: invalid pubkey data");
}
async function resolveMeta(meta, previous, instructionData, hookProgram, rpc) {
  const role = roleFor(meta.isSigner, meta.isWritable);
  if (meta.discriminator === 0) {
    return { address: addressDecoder.decode(meta.addressConfig), role };
  }
  if (meta.discriminator === 2) {
    return { address: await unpackPubkeyData(meta.addressConfig, previous, instructionData, rpc), role };
  }
  const programId = meta.discriminator === 1 ? hookProgram : previous[meta.discriminator - PDA_PROGRAM_INDEX_OFFSET].address;
  const seeds = await unpackSeeds(meta.addressConfig, previous, instructionData, rpc);
  const [pda] = await getProgramDerivedAddress7({ programAddress: programId, seeds });
  return { address: pda, role };
}
async function resolveTransferHookAccounts(rpc, args) {
  if (args.transferHookAccounts?.length) return args.transferHookAccounts;
  if (args.tokenProgram !== TOKEN_2022_PROGRAM_ADDRESS) return [];
  const { data } = await fetchMint(rpc, args.mint);
  const extensions = data.extensions.__option === "Some" ? data.extensions.value : [];
  const hook = extensions.find((extension) => extension.__kind === "TransferHook");
  if (!hook || hook.programId === DEFAULT_ADDRESS) return [];
  const hookProgram = hook.programId;
  const [validationPda] = await getProgramDerivedAddress7({
    programAddress: hookProgram,
    seeds: [EXTRA_ACCOUNT_METAS_SEED, addressEncoder.encode(args.mint)]
  });
  const trailing = [
    { address: hookProgram, role: AccountRole.READONLY },
    { address: validationPda, role: AccountRole.READONLY }
  ];
  const validationAccount = await fetchEncodedAccount7(rpc, validationPda);
  if (!validationAccount.exists) return trailing;
  const instructionData = executeInstructionData(args.amount);
  const previous = [
    { address: args.source, role: AccountRole.READONLY },
    { address: args.mint, role: AccountRole.READONLY },
    { address: args.destination, role: AccountRole.READONLY },
    { address: args.authority, role: AccountRole.READONLY },
    { address: validationPda, role: AccountRole.READONLY }
  ];
  for (const meta of readMetas(validationAccount.data)) {
    const resolved = await resolveMeta(meta, previous, instructionData, hookProgram, rpc);
    previous.push(resolved);
    trailing.push(resolved);
  }
  return trailing;
}

// src/validators.ts
var textEncoder = new TextEncoder();
var ValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
};
function assertPositive(value, name) {
  if (BigInt(value) <= 0n) throw new ValidationError(`${name} must be greater than zero`);
}
function assertSafeU64(value, name) {
  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new ValidationError(`${name} must be a bigint or a safe integer (numbers above 2^53-1 lose precision)`);
}
function assertMetadataUri(metadataUri) {
  if (textEncoder.encode(metadataUri).length > METADATA_URI_LEN)
    throw new ValidationError(`metadataUri exceeds ${METADATA_URI_LEN} bytes`);
}
function assertMaxLen(arr, max, name) {
  if (arr.length > max) throw new ValidationError(`${name} must have at most ${max} entries`);
}
function padAddresses(addresses, maxLen) {
  return Array.from({ length: maxLen }, (_, i) => addresses[i] ?? ZERO_ADDRESS);
}
function padPlanDestinations(addresses) {
  assertMaxLen(addresses, MAX_PLAN_DESTINATIONS, "destinations");
  return padAddresses(addresses, MAX_PLAN_DESTINATIONS);
}
function padPlanPullers(addresses) {
  assertMaxLen(addresses, MAX_PLAN_PULLERS, "pullers");
  return padAddresses(addresses, MAX_PLAN_PULLERS);
}

// src/plugin.ts
function pdaConfig(programAddress) {
  return programAddress ? { programAddress } : {};
}
function withTrailing(instruction, trailing) {
  if (trailing.length === 0) return instruction;
  const accounts = [
    ...instruction.accounts ?? [],
    ...trailing
  ];
  return { ...instruction, accounts };
}
function appendPayer(instruction, payer) {
  if (!payer) return instruction;
  return withTrailing(instruction, [
    {
      address: payer.address,
      role: AccountRole2.WRITABLE_SIGNER,
      signer: payer
    }
  ]);
}
async function getInitSubscriptionAuthorityOverlayInstructionAsync(input) {
  return appendPayer(
    await getInitSubscriptionAuthorityInstructionAsync(
      {
        owner: input.owner,
        tokenMint: input.tokenMint,
        tokenProgram: input.tokenProgram,
        userAta: input.userAta
      },
      pdaConfig(input.programAddress)
    ),
    input.payer
  );
}
async function getCloseSubscriptionAuthorityOverlayInstructionAsync(input) {
  const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.user.address },
    pdaConfig(input.programAddress)
  );
  let ix = getCloseSubscriptionAuthorityInstruction(
    { subscriptionAuthority, user: input.user },
    pdaConfig(input.programAddress)
  );
  if (input.receiver) {
    ix = withTrailing(ix, [{ address: input.receiver, role: AccountRole2.WRITABLE }]);
  }
  return ix;
}
async function getRevokeSubscriptionAuthorityOverlayInstructionAsync(input) {
  const [userAta] = await findAssociatedTokenPda({
    mint: input.tokenMint,
    owner: input.user.address,
    tokenProgram: input.tokenProgram
  });
  return getRevokeSubscriptionAuthorityInstruction(
    {
      tokenMint: input.tokenMint,
      tokenProgram: input.tokenProgram,
      user: input.user,
      userAta
    },
    pdaConfig(input.programAddress)
  );
}
async function getCreateFixedDelegationOverlayInstructionAsync(input) {
  assertPositive(input.amount, "amount");
  if (input.expectedSubscriptionAuthorityInitId === void 0) {
    throw new Error(
      "getCreateFixedDelegationOverlayInstructionAsync requires expectedSubscriptionAuthorityInitId. Use the plugin client `subscriptions.instructions.createFixedDelegation(...)` to auto-fetch from the live authority."
    );
  }
  const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.delegator.address },
    pdaConfig(input.programAddress)
  );
  const [delegationPda] = await findFixedDelegationPda(
    {
      delegatee: input.delegatee,
      delegator: input.delegator.address,
      nonce: input.nonce,
      subscriptionAuthority
    },
    pdaConfig(input.programAddress)
  );
  return appendPayer(
    getCreateFixedDelegationInstruction(
      {
        delegatee: input.delegatee,
        delegationAccount: delegationPda,
        delegator: input.delegator,
        fixedDelegation: {
          amount: input.amount,
          expectedSubscriptionAuthorityInitId: input.expectedSubscriptionAuthorityInitId,
          expiryTs: input.expiryTs,
          nonce: input.nonce
        },
        subscriptionAuthority
      },
      pdaConfig(input.programAddress)
    ),
    input.payer
  );
}
async function getCreateRecurringDelegationOverlayInstructionAsync(input) {
  assertPositive(input.amountPerPeriod, "amountPerPeriod");
  assertPositive(input.periodLengthS, "periodLengthS");
  if (input.expectedSubscriptionAuthorityInitId === void 0) {
    throw new Error(
      "getCreateRecurringDelegationOverlayInstructionAsync requires expectedSubscriptionAuthorityInitId. Use the plugin client `subscriptions.instructions.createRecurringDelegation(...)` to auto-fetch from the live authority."
    );
  }
  const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.delegator.address },
    pdaConfig(input.programAddress)
  );
  const [delegationPda] = await findRecurringDelegationPda(
    {
      delegatee: input.delegatee,
      delegator: input.delegator.address,
      nonce: input.nonce,
      subscriptionAuthority
    },
    pdaConfig(input.programAddress)
  );
  return appendPayer(
    getCreateRecurringDelegationInstruction(
      {
        delegatee: input.delegatee,
        delegationAccount: delegationPda,
        delegator: input.delegator,
        recurringDelegation: {
          amountPerPeriod: input.amountPerPeriod,
          expectedSubscriptionAuthorityInitId: input.expectedSubscriptionAuthorityInitId,
          expiryTs: input.expiryTs,
          nonce: input.nonce,
          periodLengthS: input.periodLengthS,
          startTs: input.startTs
        },
        subscriptionAuthority
      },
      pdaConfig(input.programAddress)
    ),
    input.payer
  );
}
function getRevokeDelegationOverlayInstruction(input) {
  let ix = getRevokeDelegationInstruction(
    {
      authority: input.authority,
      delegationAccount: input.delegationAccount
    },
    pdaConfig(input.programAddress)
  );
  if (input.receiver) {
    ix = withTrailing(ix, [{ address: input.receiver, role: AccountRole2.WRITABLE }]);
  }
  return ix;
}
function getRevokeSubscriptionOverlayInstruction(input) {
  const trailing = [{ address: input.planPda, role: AccountRole2.READONLY }];
  if (input.receiver) {
    trailing.push({ address: input.receiver, role: AccountRole2.WRITABLE });
  }
  return withTrailing(
    getRevokeDelegationInstruction(
      {
        authority: input.authority,
        delegationAccount: input.subscriptionPda
      },
      pdaConfig(input.programAddress)
    ),
    trailing
  );
}
async function getTransferDelegationOverlayInstructionAsync(input, getInstruction) {
  assertPositive(input.amount, "amount");
  const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.delegator },
    pdaConfig(input.programAddress)
  );
  return withTrailing(
    getInstruction(
      {
        delegatee: input.delegatee,
        delegationPda: input.delegationPda,
        delegatorAta: input.delegatorAta,
        receiverAta: input.receiverAta,
        subscriptionAuthority,
        tokenMint: input.tokenMint,
        tokenProgram: input.tokenProgram,
        transferData: {
          amount: input.amount,
          delegator: input.delegator,
          mint: input.tokenMint
        }
      },
      pdaConfig(input.programAddress)
    ),
    input.transferHookAccounts ?? []
  );
}
function getTransferFixedOverlayInstructionAsync(input) {
  return getTransferDelegationOverlayInstructionAsync(input, getTransferFixedInstruction);
}
function getTransferRecurringOverlayInstructionAsync(input) {
  return getTransferDelegationOverlayInstructionAsync(input, getTransferRecurringInstruction);
}
async function getTransferSubscriptionOverlayInstructionAsync(input) {
  assertPositive(input.amount, "amount");
  const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.delegator },
    pdaConfig(input.programAddress)
  );
  const [delegatorAta] = await findAssociatedTokenPda({
    mint: input.tokenMint,
    owner: input.delegator,
    tokenProgram: input.tokenProgram
  });
  return withTrailing(
    getTransferSubscriptionInstruction(
      {
        caller: input.caller,
        delegatorAta,
        planPda: input.planPda,
        receiverAta: input.receiverAta,
        subscriptionAuthority,
        subscriptionPda: input.subscriptionPda,
        tokenMint: input.tokenMint,
        tokenProgram: input.tokenProgram,
        transferData: {
          amount: input.amount,
          delegator: input.delegator,
          mint: input.tokenMint
        }
      },
      pdaConfig(input.programAddress)
    ),
    input.transferHookAccounts ?? []
  );
}
async function getCreatePlanOverlayInstructionAsync(input) {
  assertPositive(input.amount, "amount");
  assertPositive(input.periodHours, "periodHours");
  assertSafeU64(input.planId, "planId");
  assertMetadataUri(input.metadataUri);
  const destinations = padPlanDestinations(input.destinations);
  const pullers = padPlanPullers(input.pullers);
  const [planPda] = await findPlanPda(
    { owner: input.owner.address, planId: input.planId },
    pdaConfig(input.programAddress)
  );
  return getCreatePlanInstruction(
    {
      merchant: input.owner,
      planData: {
        destinations,
        endTs: input.endTs,
        metadataUri: input.metadataUri,
        mint: input.mint,
        planId: input.planId,
        pullers,
        terms: {
          amount: input.amount,
          createdAt: 0n,
          periodHours: input.periodHours
        }
      },
      planPda,
      tokenMint: input.mint,
      tokenProgram: input.tokenProgram
    },
    pdaConfig(input.programAddress)
  );
}
function getUpdatePlanOverlayInstruction(input) {
  assertMetadataUri(input.metadataUri);
  const pullers = padPlanPullers(input.pullers);
  return getUpdatePlanInstruction(
    {
      owner: input.owner,
      planPda: input.planPda,
      updatePlanData: {
        endTs: input.endTs,
        metadataUri: input.metadataUri,
        pullers,
        status: input.status
      }
    },
    pdaConfig(input.programAddress)
  );
}
function getDeletePlanOverlayInstruction(input) {
  return getDeletePlanInstruction({ owner: input.owner, planPda: input.planPda }, pdaConfig(input.programAddress));
}
async function getSubscribeOverlayInstructionAsync(input) {
  if (input.expectedAmount === void 0 || input.expectedPeriodHours === void 0 || input.expectedCreatedAt === void 0 || input.expectedSubscriptionAuthorityInitId === void 0) {
    throw new Error(
      "getSubscribeOverlayInstructionAsync requires expectedAmount, expectedPeriodHours, expectedCreatedAt, and expectedSubscriptionAuthorityInitId. Use the plugin client `subscriptions.instructions.subscribe(...)` to auto-fetch from the live plan and authority."
    );
  }
  assertSafeU64(input.planId, "planId");
  const [planPda, planBump] = await findPlanPda(
    { owner: input.merchant, planId: input.planId },
    pdaConfig(input.programAddress)
  );
  const [subscriptionAuthorityPda] = await findSubscriptionAuthorityPda(
    { tokenMint: input.tokenMint, user: input.subscriber.address },
    pdaConfig(input.programAddress)
  );
  return appendPayer(
    await getSubscribeInstructionAsync(
      {
        merchant: input.merchant,
        planPda,
        subscribeData: {
          expectedAmount: input.expectedAmount,
          expectedCreatedAt: input.expectedCreatedAt,
          expectedMint: input.tokenMint,
          expectedPeriodHours: input.expectedPeriodHours,
          expectedSubscriptionAuthorityInitId: input.expectedSubscriptionAuthorityInitId,
          planBump,
          planId: input.planId
        },
        subscriber: input.subscriber,
        subscriptionAuthorityPda
      },
      pdaConfig(input.programAddress)
    ),
    input.payer
  );
}
function getCancelSubscriptionOverlayInstructionAsync(input) {
  return getCancelSubscriptionInstructionAsync(
    {
      planPda: input.planPda,
      subscriber: input.subscriber,
      subscriptionPda: input.subscriptionPda
    },
    pdaConfig(input.programAddress)
  );
}
function getResumeSubscriptionOverlayInstructionAsync(input) {
  return getResumeSubscriptionInstructionAsync(
    {
      planPda: input.planPda,
      subscriber: input.subscriber,
      subscriptionPda: input.subscriptionPda
    },
    pdaConfig(input.programAddress)
  );
}
function subscriptionsProgram2() {
  return (client) => {
    return pipe(client, subscriptionsProgram(), (c) => {
      const queries = {
        activeDelegationSummary: async (wallet) => {
          const delegations = await fetchDelegationsByDelegator(c.rpc, wallet);
          let fixed = 0;
          let recurring = 0;
          let subscriptions = 0;
          for (const d of delegations) {
            if (d.kind === "fixed") fixed++;
            else if (d.kind === "recurring") recurring++;
            else if (d.kind === "subscription") subscriptions++;
          }
          return { fixed, recurring, subscriptions, total: delegations.length };
        },
        delegationsByDelegatee: (wallet) => fetchDelegationsByDelegatee(c.rpc, wallet),
        delegationsByDelegator: (wallet) => fetchDelegationsByDelegator(c.rpc, wallet),
        isSubscriptionAuthorityInitialized: async (user, tokenMint, programAddress) => {
          const [pda] = await findSubscriptionAuthorityPda({ tokenMint, user }, pdaConfig(programAddress));
          const account = await fetchMaybeSubscriptionAuthority(c.rpc, pda);
          return { initialized: account.exists, pda };
        },
        plansForOwner: (owner) => fetchPlansForOwner(c.rpc, owner)
      };
      const resolveExpectedSubscriptionAuthorityInitId = async (tokenMint, user, programAddress, expectedSubscriptionAuthorityInitId) => {
        if (expectedSubscriptionAuthorityInitId !== void 0) {
          return expectedSubscriptionAuthorityInitId;
        }
        const [subscriptionAuthorityPda] = await findSubscriptionAuthorityPda(
          { tokenMint, user },
          pdaConfig(programAddress)
        );
        const subscriptionAuthority = await fetchMaybeSubscriptionAuthority(c.rpc, subscriptionAuthorityPda);
        if (!subscriptionAuthority.exists) {
          throw new Error("SubscriptionAuthority is not initialized for this delegator and token mint.");
        }
        return subscriptionAuthority.data.initId;
      };
      const resolveDelegationHookAccounts = async (input) => {
        const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
          { tokenMint: input.tokenMint, user: input.delegator },
          pdaConfig(input.programAddress)
        );
        return await resolveTransferHookAccounts(c.rpc, {
          amount: input.amount,
          authority: subscriptionAuthority,
          destination: input.receiverAta,
          mint: input.tokenMint,
          source: input.delegatorAta,
          tokenProgram: input.tokenProgram,
          transferHookAccounts: input.transferHookAccounts
        });
      };
      const instructions = {
        cancelSubscription: (input) => addSelfPlanAndSendFunctions2(
          client,
          getCancelSubscriptionOverlayInstructionAsync({
            ...input,
            subscriber: input.subscriber ?? client.identity
          })
        ),
        closeSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions2(
          client,
          getCloseSubscriptionAuthorityOverlayInstructionAsync({
            ...input,
            user: input.user ?? client.identity
          })
        ),
        createFixedDelegation: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => {
            const delegator = input.delegator ?? client.identity;
            const expectedSubscriptionAuthorityInitId = await resolveExpectedSubscriptionAuthorityInitId(
              input.tokenMint,
              delegator.address,
              input.programAddress,
              input.expectedSubscriptionAuthorityInitId
            );
            return await getCreateFixedDelegationOverlayInstructionAsync({
              ...input,
              delegator,
              expectedSubscriptionAuthorityInitId,
              payer: input.payer ?? (client.payer === client.identity ? void 0 : client.payer)
            });
          })()
        ),
        createPlan: (input) => addSelfPlanAndSendFunctions2(
          client,
          getCreatePlanOverlayInstructionAsync({
            ...input,
            owner: input.owner ?? client.identity
          })
        ),
        createRecurringDelegation: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => {
            const delegator = input.delegator ?? client.identity;
            const expectedSubscriptionAuthorityInitId = await resolveExpectedSubscriptionAuthorityInitId(
              input.tokenMint,
              delegator.address,
              input.programAddress,
              input.expectedSubscriptionAuthorityInitId
            );
            return await getCreateRecurringDelegationOverlayInstructionAsync({
              ...input,
              delegator,
              expectedSubscriptionAuthorityInitId,
              payer: input.payer ?? (client.payer === client.identity ? void 0 : client.payer)
            });
          })()
        ),
        deletePlan: (input) => addSelfPlanAndSendFunctions2(
          client,
          getDeletePlanOverlayInstruction({
            ...input,
            owner: input.owner ?? client.identity
          })
        ),
        initSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions2(
          client,
          getInitSubscriptionAuthorityOverlayInstructionAsync({
            ...input,
            owner: input.owner ?? client.identity,
            payer: input.payer ?? (client.payer === client.identity ? void 0 : client.payer)
          })
        ),
        resumeSubscription: (input) => addSelfPlanAndSendFunctions2(
          client,
          getResumeSubscriptionOverlayInstructionAsync({
            ...input,
            subscriber: input.subscriber ?? client.identity
          })
        ),
        revokeDelegation: (input) => addSelfPlanAndSendFunctions2(
          client,
          getRevokeDelegationOverlayInstruction({
            ...input,
            authority: input.authority ?? client.identity
          })
        ),
        revokeSubscription: (input) => addSelfPlanAndSendFunctions2(
          client,
          getRevokeSubscriptionOverlayInstruction({
            ...input,
            authority: input.authority ?? client.identity
          })
        ),
        revokeSubscriptionAuthority: (input) => addSelfPlanAndSendFunctions2(
          client,
          getRevokeSubscriptionAuthorityOverlayInstructionAsync({
            ...input,
            user: input.user ?? client.identity
          })
        ),
        subscribe: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => {
            const subscriber = input.subscriber ?? client.identity;
            assertSafeU64(input.planId, "planId");
            let {
              expectedAmount,
              expectedCreatedAt,
              expectedPeriodHours,
              expectedSubscriptionAuthorityInitId
            } = input;
            if (expectedAmount === void 0 || expectedPeriodHours === void 0 || expectedCreatedAt === void 0) {
              const [planPda] = await findPlanPda(
                { owner: input.merchant, planId: input.planId },
                pdaConfig(input.programAddress)
              );
              const plan = await fetchPlan(c.rpc, planPda);
              expectedAmount = expectedAmount ?? plan.data.data.terms.amount;
              expectedPeriodHours = expectedPeriodHours ?? plan.data.data.terms.periodHours;
              expectedCreatedAt = expectedCreatedAt ?? plan.data.data.terms.createdAt;
            }
            if (expectedSubscriptionAuthorityInitId === void 0) {
              const [subscriptionAuthorityPda] = await findSubscriptionAuthorityPda(
                { tokenMint: input.tokenMint, user: subscriber.address },
                pdaConfig(input.programAddress)
              );
              const subscriptionAuthority = await fetchMaybeSubscriptionAuthority(
                c.rpc,
                subscriptionAuthorityPda
              );
              if (!subscriptionAuthority.exists) {
                throw new Error(
                  "SubscriptionAuthority is not initialized for this subscriber and token mint."
                );
              }
              expectedSubscriptionAuthorityInitId = subscriptionAuthority.data.initId;
            }
            return await getSubscribeOverlayInstructionAsync({
              ...input,
              expectedAmount,
              expectedCreatedAt,
              expectedPeriodHours,
              expectedSubscriptionAuthorityInitId,
              payer: input.payer ?? (client.payer === client.identity ? void 0 : client.payer),
              subscriber
            });
          })()
        ),
        transferFixed: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => await getTransferFixedOverlayInstructionAsync({
            ...input,
            delegatee: input.delegatee ?? client.identity,
            transferHookAccounts: await resolveDelegationHookAccounts(input)
          }))()
        ),
        transferRecurring: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => await getTransferRecurringOverlayInstructionAsync({
            ...input,
            delegatee: input.delegatee ?? client.identity,
            transferHookAccounts: await resolveDelegationHookAccounts(input)
          }))()
        ),
        transferSubscription: (input) => addSelfPlanAndSendFunctions2(
          client,
          (async () => {
            const [subscriptionAuthority] = await findSubscriptionAuthorityPda(
              { tokenMint: input.tokenMint, user: input.delegator },
              pdaConfig(input.programAddress)
            );
            const [delegatorAta] = await findAssociatedTokenPda({
              mint: input.tokenMint,
              owner: input.delegator,
              tokenProgram: input.tokenProgram
            });
            const transferHookAccounts = await resolveTransferHookAccounts(c.rpc, {
              amount: input.amount,
              authority: subscriptionAuthority,
              destination: input.receiverAta,
              mint: input.tokenMint,
              source: delegatorAta,
              tokenProgram: input.tokenProgram,
              transferHookAccounts: input.transferHookAccounts
            });
            return await getTransferSubscriptionOverlayInstructionAsync({
              ...input,
              caller: input.caller ?? client.identity,
              transferHookAccounts
            });
          })()
        ),
        updatePlan: (input) => addSelfPlanAndSendFunctions2(
          client,
          getUpdatePlanOverlayInstruction({
            ...input,
            owner: input.owner ?? client.identity
          })
        )
      };
      return {
        ...c,
        subscriptions: {
          ...c.subscriptions,
          instructions,
          queries
        }
      };
    });
  };
}
export {
  AccountDiscriminator,
  CANCEL_SUBSCRIPTION_DISCRIMINATOR,
  CLOSE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR,
  CREATE_FIXED_DELEGATION_DISCRIMINATOR,
  CREATE_PLAN_DISCRIMINATOR,
  CREATE_RECURRING_DELEGATION_DISCRIMINATOR,
  CURRENT_PROGRAM_VERSION,
  DELEGATEE_OFFSET,
  DELEGATION_SEED,
  DELEGATOR_OFFSET,
  DELETE_PLAN_DISCRIMINATOR,
  DISCRIMINATOR_OFFSET,
  EVENT_AUTHORITY_SEED,
  INIT_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR,
  MAX_PLAN_DESTINATIONS,
  MAX_PLAN_PULLERS,
  METADATA_URI_LEN,
  PLAN_OWNER_OFFSET,
  PLAN_SEED,
  PLAN_SIZE,
  PROGRAM_ID,
  PlanStatus,
  RESUME_SUBSCRIPTION_DISCRIMINATOR,
  REVOKE_ABANDONED_DELEGATION_DISCRIMINATOR,
  REVOKE_DELEGATION_DISCRIMINATOR,
  REVOKE_SUBSCRIPTION_AUTHORITY_DISCRIMINATOR,
  SUBSCRIBE_DISCRIMINATOR,
  SUBSCRIPTIONS_ERROR__ACCOUNT_NOT_WRITABLE,
  SUBSCRIPTIONS_ERROR__ALREADY_SUBSCRIBED,
  SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_LIMIT,
  SUBSCRIPTIONS_ERROR__AMOUNT_EXCEEDS_PERIOD_LIMIT,
  SUBSCRIPTIONS_ERROR__ARITHMETIC_OVERFLOW,
  SUBSCRIPTIONS_ERROR__ARITHMETIC_UNDERFLOW,
  SUBSCRIPTIONS_ERROR__ATA_OWNER_MISMATCH,
  SUBSCRIPTIONS_ERROR__DELEGATION_ALREADY_EXISTS,
  SUBSCRIPTIONS_ERROR__DELEGATION_EXPIRED,
  SUBSCRIPTIONS_ERROR__DELEGATION_NOT_STARTED,
  SUBSCRIPTIONS_ERROR__DELEGATION_VERSION_MISMATCH,
  SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_AMOUNT_ZERO,
  SUBSCRIPTIONS_ERROR__FIXED_DELEGATION_EXPIRY_IN_PAST,
  SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_ACCOUNT_DISCRIMINATOR,
  SUBSCRIPTIONS_ERROR__INVALID_ADDRESS,
  SUBSCRIPTIONS_ERROR__INVALID_AMOUNT,
  SUBSCRIPTIONS_ERROR__INVALID_ASSOCIATED_TOKEN_ACCOUNT_DERIVED_ADDRESS,
  SUBSCRIPTIONS_ERROR__INVALID_DELEGATE_PDA,
  SUBSCRIPTIONS_ERROR__INVALID_END_TS,
  SUBSCRIPTIONS_ERROR__INVALID_ESCROW_PDA,
  SUBSCRIPTIONS_ERROR__INVALID_EVENT_AUTHORITY,
  SUBSCRIPTIONS_ERROR__INVALID_EVENT_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_EVENT_DISCRIMINATOR,
  SUBSCRIPTIONS_ERROR__INVALID_EVENT_TAG,
  SUBSCRIPTIONS_ERROR__INVALID_HEADER_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION,
  SUBSCRIPTIONS_ERROR__INVALID_INSTRUCTION_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_NUM_DESTINATIONS,
  SUBSCRIPTIONS_ERROR__INVALID_PAYER_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_PERIOD_LENGTH,
  SUBSCRIPTIONS_ERROR__INVALID_PLAN_PDA,
  SUBSCRIPTIONS_ERROR__INVALID_PLAN_STATUS,
  SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_AUTHORITY_PDA,
  SUBSCRIPTIONS_ERROR__INVALID_SUBSCRIPTION_PDA,
  SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_MINT_ACCOUNT_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_TOKEN2022_TOKEN_ACCOUNT_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_TOKEN_PROGRAM,
  SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_MINT_ACCOUNT_DATA,
  SUBSCRIPTIONS_ERROR__INVALID_TOKEN_SPL_TOKEN_ACCOUNT_DATA,
  SUBSCRIPTIONS_ERROR__MIGRATION_REQUIRED,
  SUBSCRIPTIONS_ERROR__MINT_HAS_CONFIDENTIAL_TRANSFER,
  SUBSCRIPTIONS_ERROR__MINT_HAS_MINT_CLOSE_AUTHORITY,
  SUBSCRIPTIONS_ERROR__MINT_HAS_NON_TRANSFERABLE,
  SUBSCRIPTIONS_ERROR__MINT_HAS_PAUSABLE,
  SUBSCRIPTIONS_ERROR__MINT_HAS_PERMANENT_DELEGATE,
  SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_FEE,
  SUBSCRIPTIONS_ERROR__MINT_HAS_TRANSFER_HOOK,
  SUBSCRIPTIONS_ERROR__MINT_MISMATCH,
  SUBSCRIPTIONS_ERROR__NOT_ENOUGH_ACCOUNT_KEYS,
  SUBSCRIPTIONS_ERROR__NOT_PLAN_OWNER,
  SUBSCRIPTIONS_ERROR__NOT_SIGNER,
  SUBSCRIPTIONS_ERROR__NOT_SYSTEM_PROGRAM,
  SUBSCRIPTIONS_ERROR__PERIOD_NOT_ELAPSED,
  SUBSCRIPTIONS_ERROR__PLAN_ALREADY_EXISTS,
  SUBSCRIPTIONS_ERROR__PLAN_CLOSED,
  SUBSCRIPTIONS_ERROR__PLAN_EXPIRED,
  SUBSCRIPTIONS_ERROR__PLAN_IMMUTABLE_AFTER_SUNSET,
  SUBSCRIPTIONS_ERROR__PLAN_NOT_EXPIRED,
  SUBSCRIPTIONS_ERROR__PLAN_SUNSET,
  SUBSCRIPTIONS_ERROR__PLAN_TERMS_MISMATCH,
  SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_AMOUNT_ZERO,
  SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_ON_LANDING_REQUIRES_EXPIRY,
  SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_GREATER_THAN_EXPIRY,
  SUBSCRIPTIONS_ERROR__RECURRING_DELEGATION_START_TIME_IN_PAST,
  SUBSCRIPTIONS_ERROR__STALE_SUBSCRIPTION_AUTHORITY,
  SUBSCRIPTIONS_ERROR__SUBSCRIPTION_ALREADY_CANCELLED,
  SUBSCRIPTIONS_ERROR__SUBSCRIPTION_CANCELLED,
  SUBSCRIPTIONS_ERROR__SUBSCRIPTION_NOT_CANCELLED,
  SUBSCRIPTIONS_ERROR__SUBSCRIPTION_PLAN_MISMATCH,
  SUBSCRIPTIONS_ERROR__SUNSET_REQUIRES_END_TS,
  SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_TOO_MANY_ACCOUNTS,
  SUBSCRIPTIONS_ERROR__TRANSFER_HOOK_VALIDATION_ACCOUNT_MISSING,
  SUBSCRIPTIONS_ERROR__UNAUTHORIZED,
  SUBSCRIPTIONS_ERROR__UNAUTHORIZED_DESTINATION,
  SUBSCRIPTIONS_PROGRAM_ADDRESS,
  SUBSCRIPTION_AUTHORITY_SEED,
  SUBSCRIPTION_SEED,
  SUBSCRIPTION_SIZE,
  SubscriptionsAccount,
  SubscriptionsInstruction,
  TRANSFER_FIXED_DISCRIMINATOR,
  TRANSFER_RECURRING_DISCRIMINATOR,
  TRANSFER_SUBSCRIPTION_DISCRIMINATOR,
  U64_BYTE_SIZE,
  UPDATE_PLAN_DISCRIMINATOR,
  ValidationError,
  ZERO_ADDRESS,
  decodeDelegationAccount,
  decodeEventAuthority,
  decodeFixedDelegation,
  decodePlan,
  decodeRecurringDelegation,
  decodeSubscriptionAuthority,
  decodeSubscriptionDelegation,
  fetchAllEventAuthority,
  fetchAllFixedDelegation,
  fetchAllMaybeEventAuthority,
  fetchAllMaybeFixedDelegation,
  fetchAllMaybePlan,
  fetchAllMaybeRecurringDelegation,
  fetchAllMaybeSubscriptionAuthority,
  fetchAllMaybeSubscriptionDelegation,
  fetchAllPlan,
  fetchAllRecurringDelegation,
  fetchAllSubscriptionAuthority,
  fetchAllSubscriptionDelegation,
  fetchDelegationsByDelegatee,
  fetchDelegationsByDelegator,
  fetchEventAuthority,
  fetchEventAuthorityFromSeeds,
  fetchFixedDelegation,
  fetchFixedDelegationFromSeeds,
  fetchMaybeEventAuthority,
  fetchMaybeEventAuthorityFromSeeds,
  fetchMaybeFixedDelegation,
  fetchMaybeFixedDelegationFromSeeds,
  fetchMaybePlan,
  fetchMaybePlanFromSeeds,
  fetchMaybeRecurringDelegation,
  fetchMaybeRecurringDelegationFromSeeds,
  fetchMaybeSubscriptionAuthority,
  fetchMaybeSubscriptionAuthorityFromSeeds,
  fetchMaybeSubscriptionDelegation,
  fetchMaybeSubscriptionDelegationFromSeeds,
  fetchPlan,
  fetchPlanFromSeeds,
  fetchPlansForOwner,
  fetchRecurringDelegation,
  fetchRecurringDelegationFromSeeds,
  fetchSubscriptionAuthority,
  fetchSubscriptionAuthorityFromSeeds,
  fetchSubscriptionDelegation,
  fetchSubscriptionDelegationFromSeeds,
  fetchSubscriptionsForUser,
  findEventAuthorityPda,
  findFixedDelegationPda,
  findPlanPda,
  findRecurringDelegationPda,
  findSubscriptionAuthorityPda,
  findSubscriptionDelegationPda,
  getAccountDiscriminatorCodec,
  getAccountDiscriminatorDecoder,
  getAccountDiscriminatorEncoder,
  getCancelSubscriptionDiscriminatorBytes,
  getCancelSubscriptionInstruction,
  getCancelSubscriptionInstructionAsync,
  getCancelSubscriptionInstructionDataCodec,
  getCancelSubscriptionInstructionDataDecoder,
  getCancelSubscriptionInstructionDataEncoder,
  getCancelSubscriptionOverlayInstructionAsync,
  getCloseSubscriptionAuthorityDiscriminatorBytes,
  getCloseSubscriptionAuthorityInstruction,
  getCloseSubscriptionAuthorityInstructionDataCodec,
  getCloseSubscriptionAuthorityInstructionDataDecoder,
  getCloseSubscriptionAuthorityInstructionDataEncoder,
  getCloseSubscriptionAuthorityOverlayInstructionAsync,
  getCreateFixedDelegationDataCodec,
  getCreateFixedDelegationDataDecoder,
  getCreateFixedDelegationDataEncoder,
  getCreateFixedDelegationDiscriminatorBytes,
  getCreateFixedDelegationInstruction,
  getCreateFixedDelegationInstructionDataCodec,
  getCreateFixedDelegationInstructionDataDecoder,
  getCreateFixedDelegationInstructionDataEncoder,
  getCreateFixedDelegationOverlayInstructionAsync,
  getCreatePlanDiscriminatorBytes,
  getCreatePlanInstruction,
  getCreatePlanInstructionDataCodec,
  getCreatePlanInstructionDataDecoder,
  getCreatePlanInstructionDataEncoder,
  getCreatePlanOverlayInstructionAsync,
  getCreateRecurringDelegationDataCodec,
  getCreateRecurringDelegationDataDecoder,
  getCreateRecurringDelegationDataEncoder,
  getCreateRecurringDelegationDiscriminatorBytes,
  getCreateRecurringDelegationInstruction,
  getCreateRecurringDelegationInstructionDataCodec,
  getCreateRecurringDelegationInstructionDataDecoder,
  getCreateRecurringDelegationInstructionDataEncoder,
  getCreateRecurringDelegationOverlayInstructionAsync,
  getDeletePlanDiscriminatorBytes,
  getDeletePlanInstruction,
  getDeletePlanInstructionDataCodec,
  getDeletePlanInstructionDataDecoder,
  getDeletePlanInstructionDataEncoder,
  getDeletePlanOverlayInstruction,
  getEventAuthorityCodec,
  getEventAuthorityDecoder,
  getEventAuthorityEncoder,
  getFixedDelegationCodec,
  getFixedDelegationDecoder,
  getFixedDelegationEncoder,
  getHeaderCodec,
  getHeaderDecoder,
  getHeaderEncoder,
  getInitSubscriptionAuthorityDiscriminatorBytes,
  getInitSubscriptionAuthorityInstruction,
  getInitSubscriptionAuthorityInstructionAsync,
  getInitSubscriptionAuthorityInstructionDataCodec,
  getInitSubscriptionAuthorityInstructionDataDecoder,
  getInitSubscriptionAuthorityInstructionDataEncoder,
  getInitSubscriptionAuthorityOverlayInstructionAsync,
  getPlanCodec,
  getPlanDataCodec,
  getPlanDataDecoder,
  getPlanDataEncoder,
  getPlanDecoder,
  getPlanEncoder,
  getPlanStatusCodec,
  getPlanStatusDecoder,
  getPlanStatusEncoder,
  getPlanTermsCodec,
  getPlanTermsDecoder,
  getPlanTermsEncoder,
  getRecurringDelegationCodec,
  getRecurringDelegationDecoder,
  getRecurringDelegationEncoder,
  getResumeSubscriptionDiscriminatorBytes,
  getResumeSubscriptionInstruction,
  getResumeSubscriptionInstructionAsync,
  getResumeSubscriptionInstructionDataCodec,
  getResumeSubscriptionInstructionDataDecoder,
  getResumeSubscriptionInstructionDataEncoder,
  getResumeSubscriptionOverlayInstructionAsync,
  getRevokeAbandonedDelegationDiscriminatorBytes,
  getRevokeAbandonedDelegationInstruction,
  getRevokeAbandonedDelegationInstructionDataCodec,
  getRevokeAbandonedDelegationInstructionDataDecoder,
  getRevokeAbandonedDelegationInstructionDataEncoder,
  getRevokeDelegationDiscriminatorBytes,
  getRevokeDelegationInstruction,
  getRevokeDelegationInstructionDataCodec,
  getRevokeDelegationInstructionDataDecoder,
  getRevokeDelegationInstructionDataEncoder,
  getRevokeDelegationOverlayInstruction,
  getRevokeSubscriptionAuthorityDiscriminatorBytes,
  getRevokeSubscriptionAuthorityInstruction,
  getRevokeSubscriptionAuthorityInstructionDataCodec,
  getRevokeSubscriptionAuthorityInstructionDataDecoder,
  getRevokeSubscriptionAuthorityInstructionDataEncoder,
  getRevokeSubscriptionAuthorityOverlayInstructionAsync,
  getRevokeSubscriptionOverlayInstruction,
  getSubscribeDataCodec,
  getSubscribeDataDecoder,
  getSubscribeDataEncoder,
  getSubscribeDiscriminatorBytes,
  getSubscribeInstruction,
  getSubscribeInstructionAsync,
  getSubscribeInstructionDataCodec,
  getSubscribeInstructionDataDecoder,
  getSubscribeInstructionDataEncoder,
  getSubscribeOverlayInstructionAsync,
  getSubscriptionAuthorityCodec,
  getSubscriptionAuthorityDecoder,
  getSubscriptionAuthorityEncoder,
  getSubscriptionDelegationCodec,
  getSubscriptionDelegationDecoder,
  getSubscriptionDelegationEncoder,
  getSubscriptionsErrorMessage,
  getTransferDataCodec,
  getTransferDataDecoder,
  getTransferDataEncoder,
  getTransferFixedDiscriminatorBytes,
  getTransferFixedInstruction,
  getTransferFixedInstructionDataCodec,
  getTransferFixedInstructionDataDecoder,
  getTransferFixedInstructionDataEncoder,
  getTransferFixedOverlayInstructionAsync,
  getTransferRecurringDiscriminatorBytes,
  getTransferRecurringInstruction,
  getTransferRecurringInstructionDataCodec,
  getTransferRecurringInstructionDataDecoder,
  getTransferRecurringInstructionDataEncoder,
  getTransferRecurringOverlayInstructionAsync,
  getTransferSubscriptionDiscriminatorBytes,
  getTransferSubscriptionInstruction,
  getTransferSubscriptionInstructionDataCodec,
  getTransferSubscriptionInstructionDataDecoder,
  getTransferSubscriptionInstructionDataEncoder,
  getTransferSubscriptionOverlayInstructionAsync,
  getUpdatePlanDataCodec,
  getUpdatePlanDataDecoder,
  getUpdatePlanDataEncoder,
  getUpdatePlanDiscriminatorBytes,
  getUpdatePlanInstruction,
  getUpdatePlanInstructionDataCodec,
  getUpdatePlanInstructionDataDecoder,
  getUpdatePlanInstructionDataEncoder,
  getUpdatePlanOverlayInstruction,
  identifySubscriptionsInstruction,
  isSubscriptionsError,
  parseCancelSubscriptionInstruction,
  parseCloseSubscriptionAuthorityInstruction,
  parseCreateFixedDelegationInstruction,
  parseCreatePlanInstruction,
  parseCreateRecurringDelegationInstruction,
  parseDeletePlanInstruction,
  parseInitSubscriptionAuthorityInstruction,
  parseResumeSubscriptionInstruction,
  parseRevokeAbandonedDelegationInstruction,
  parseRevokeDelegationInstruction,
  parseRevokeSubscriptionAuthorityInstruction,
  parseSubscribeInstruction,
  parseSubscriptionsInstruction,
  parseTransferFixedInstruction,
  parseTransferRecurringInstruction,
  parseTransferSubscriptionInstruction,
  parseUpdatePlanInstruction,
  resolveTransferHookAccounts,
  subscriptionsProgram2 as subscriptionsProgram,
  toEncodedAccount
};
//# sourceMappingURL=index.js.map