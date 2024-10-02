// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title LucidToken
 * @dev Implementation of the Lucid Token (LCD)
 * 
 * This contract creates a token with a fixed supply, burning capabilities,
 * and support for EIP-2612 permit function for gasless approvals.
 */
contract LucidToken is ERC20Permit, ERC20Burnable {
  // Initial supply: 888,888,888.88 tokens with 18 decimal places
  uint256 private constant INITIAL_SUPPLY = 888_888_888_88 * 10**18;
  
  // Tracking of burned tokens
  uint256 private _totalBurned;
  mapping(address => uint256) private _burnedTokens;

  /**
    * @dev Emitted when tokens are burned
    * @param burner Address of the account burning tokens
    * @param amount Amount of tokens burned
    */
  event TokensBurned(address indexed burner, uint256 amount);

  /**
    * @dev Constructor that gives the msg.sender all of the initial supply.
    */
  constructor() ERC20("Lucid", "LCD") ERC20Permit("Lucid") {
    _mint(msg.sender, INITIAL_SUPPLY);
  }

  /**
    * @dev Returns the number of decimals used to get its user representation.
    * For example, if `decimals` equals `2`, a balance of `505` tokens should
    * be displayed to a user as `5.05` (`505 / 10 ** 2`).
    */
  function decimals() public view virtual override returns (uint8) {
    return 18;
  }

  /**
    * @dev Destroys `amount` tokens from the caller.
    * @param amount The amount of tokens to be burned.
    */
  function burn(uint256 amount) public virtual override {
    super.burn(amount);
    _recordBurn(_msgSender(), amount);
  }

  /**
    * @dev Destroys `amount` tokens from `account`, deducting from the caller's
    * allowance.
    * @param account The account whose tokens will be burned.
    * @param amount The amount of tokens to be burned.
    */
  function burnFrom(address account, uint256 amount) public virtual override {
    super.burnFrom(account, amount);
    _recordBurn(account, amount);
  }

  /**
    * @dev Returns the amount of tokens burned by a specific account.
    * @param account The address to query the burned amount for.
    * @return The amount of burned tokens.
    */
  function getBurnedTokens(address account) public view returns (uint256) {
    return _burnedTokens[account];
  }

  /**
    * @dev Returns the total amount of tokens burned.
    * @return The total amount of burned tokens.
    */
  function totalBurnedTokens() public view returns (uint256) {
    return _totalBurned;
  }

  /**
    * @dev Internal function to record token burns.
    * @param account The address that burned tokens.
    * @param amount The amount of tokens burned.
    */
  function _recordBurn(address account, uint256 amount) private {
    _burnedTokens[account] += amount;
    _totalBurned += amount;
    emit TokensBurned(account, amount);
  }
}
