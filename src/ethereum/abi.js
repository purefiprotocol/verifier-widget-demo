export const ERC20TokenABI = [
  'function symbol() public view returns (string)',
  'function decimals() public view returns (uint8)',
  'function balanceOf(address _owner) public view returns (uint256 balance)',
  'function allowance(address _owner, address _spender) public view returns (uint256 remaining)',
  'function approve(address _spender, uint256 _value) public returns (bool success)',
];
