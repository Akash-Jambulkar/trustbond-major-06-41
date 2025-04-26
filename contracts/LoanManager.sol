
pragma solidity 0.5.16;

import "./TrustScore.sol";
import "./KYCVerifier.sol";

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
    TrustScore public trustScoreContract;
    KYCVerifier public kycVerifierContract;
    
    event LoanRequested(uint256 indexed loanId, address borrower, uint256 amount);
    event LoanApproved(uint256 indexed loanId);
    event LoanRepaid(uint256 indexed loanId);
    
    constructor(address _trustScoreContract, address _kycVerifierContract) public {
        trustScoreContract = TrustScore(_trustScoreContract);
        kycVerifierContract = KYCVerifier(_kycVerifierContract);
        loanCount = 0;
    }
    
    function requestLoan(uint256 amount, uint256 duration) public returns (uint256) {
        require(amount > 0, "Loan amount must be greater than 0");
        require(duration > 0, "Loan duration must be greater than 0");
        require(kycVerifierContract.isVerified(msg.sender), "KYC verification required");
        
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
    
    function approveLoan(uint256 loanId) public {
        require(loans[loanId].borrower != address(0), "Loan does not exist");
        require(!loans[loanId].approved, "Loan already approved");
        
        loans[loanId].approved = true;
        emit LoanApproved(loanId);
    }
    
    function repayLoan(uint256 loanId) public payable {
        require(loans[loanId].borrower == msg.sender, "Not the borrower");
        require(loans[loanId].approved, "Loan not approved");
        require(!loans[loanId].repaid, "Loan already repaid");
        require(msg.value >= loans[loanId].amount, "Insufficient repayment amount");
        
        loans[loanId].repaid = true;
        emit LoanRepaid(loanId);
    }
    
    function getLoan(uint256 loanId) public view returns (
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        address borrower,
        bool approved,
        bool repaid
    ) {
        Loan memory loan = loans[loanId];
        return (
            loan.amount,
            loan.interestRate,
            loan.duration,
            loan.borrower,
            loan.approved,
            loan.repaid
        );
    }
}
