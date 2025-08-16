import { BigDecimal } from "@graphprotocol/graph-ts"
import { Borrow, LiquidationCall } from "../generated/Pool/Pool"
import { CDP } from "../generated/schema"

export function handleBorrow(event: Borrow): void {
  const id = event.params.user.toHex()
  let cdp = CDP.load(id)
  if (cdp == null) {
    cdp = new CDP(id)
    cdp.owner = event.params.user
    cdp.collateral = BigDecimal.fromString("0")
    cdp.debt = BigDecimal.fromString("0")
    cdp.healthFactor = BigDecimal.fromString("1.5")
  }

  cdp.debt = cdp.debt.plus(event.params.amount.toBigDecimal())
  cdp.healthFactor = cdp.healthFactor.minus(
    event.params.amount.toBigDecimal().div(BigDecimal.fromString("1000000"))
  )
  cdp.save()
}

export function handleLiquidationCall(event: LiquidationCall): void {
  const id = event.params.user.toHex();
  let cdp = CDP.load(id)
  if (cdp == null) return

  // mark liquidated
  cdp.healthFactor = BigDecimal.fromString("0")
  cdp.save()
}
