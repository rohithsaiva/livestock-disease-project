class BankAccount {
    int balance = 1000;

    synchronized void deposit(int amount) {
        balance += amount;
        System.out.println("Deposited: " + amount);
        System.out.println("Balance: " + balance);
    }

    synchronized void withdraw(int amount) {
        if (balance >= amount) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount);
            System.out.println("Balance: " + balance);
        } else {
            System.out.println("Insufficient balance");
        }
    }
}

class User extends Thread {
    BankAccount acc;

    User(BankAccount acc) {
        this.acc = acc;
    }

    public void run() {
        acc.withdraw(500);
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount acc = new BankAccount();

        User u1 = new User(acc);
        User u2 = new User(acc);

        u1.start();
        u2.start();
    }
}