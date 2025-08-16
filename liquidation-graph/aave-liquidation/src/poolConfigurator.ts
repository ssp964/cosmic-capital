import { CollateralConfigurationChanged } from "../generated/PoolConfigurator/PoolConfigurator"
import { CDP } from "../generated/schema"

export function handleCollateralConfigurationChanged(
  event: CollateralConfigurationChanged
): void {
  // optional: update a global "config" entity later
  // right now we leave this empty so codegen + build succeeds
}
