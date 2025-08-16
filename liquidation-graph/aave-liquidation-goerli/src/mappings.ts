import { BigDecimal } from "@graphprotocol/graph-ts";
import { Borrow, LiquidationCall, Deposit } from "../generated/Pool/Pool";
import { CDP } from "../generated/schema";
import { Pool as LPContract } from "../generated/Pool/Pool";

export function handleBorrow(event: Borrow): void {
  let id = event.params.user.toHex();
  let cdp = CDP.load(id);
  if (!cdp) {
    cdp = new CDP(id);
    cdp.owner = event.params.user;
    cdp.collateral = BigDecimal.fromString("0");
    cdp.debt = BigDecimal.fromString("0");
    cdp.healthFactor = BigDecimal.fromString("0");
  }
  cdp.debt = cdp.debt.plus(event.params.amount.toBigDecimal());

  let pool = LPContract.bind(event.address);
  let result = pool.getUserAccountData(event.params.user);
  cdp.healthFactor = result.getHealthFactor().toBigDecimal();

  cdp.save();
}

export function handleLiquidationCall(event: LiquidationCall): void {
    let id = event.params.user.toHex()
    let cdp = CDP.load(id)
    if (cdp != null) {
      // reduce debt by amount repaid
      cdp.debt = cdp.debt.minus(event.params.debtToCover.toBigDecimal())
      // reduce collateral by liquidated amount
      cdp.collateral = cdp.collateral.minus(event.params.liquidatedCollateralAmount.toBigDecimal())
      cdp.save()
    }
  }


  