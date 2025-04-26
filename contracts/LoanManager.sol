
pragma solidity 0.5.16;

contract LoanManager {
    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        address borrower;
        bool approved;
        bool repaid;
    }
    
    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;
    address public trustScoreContract;
    address public kycVerifierContract;
    
    event LoanRequested(uint256 indexed loanId, address borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId);
    event LoanRepaid(uint256 indexed loanId);
    
    constructor(address _trustScoreContract, address _kycVerifierContract) public {
        trustScoreContract = _trustScoreContract;
        kycVerifierContract = _kycVerifierContract;
    }
    
    function requestLoan(uint256 amount, uint256 duration) public returns (uint256) {
        uint256 loanId = loanCount++;
        loans[loanId] = Loan({
            amount: amount,
            interestRate: 5,
            duration: duration,
            borrower: msg.sender,
            approved: false,
            repaid: false
        });
        
        emit LoanRequested(loanId, msg.sender, amount);
        return loanId;
    }
}
