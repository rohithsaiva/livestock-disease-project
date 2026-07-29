import java.util.Scanner;
public class PoweredAirIVR {
 public static void main(String[] args) {
 Scanner scanner = new Scanner(System.in);
 boolean exitMain = false;
 while (!exitMain) {
 System.out.println("\n=== Welcome to Powered Air Service ===");
 System.out.println("What would you like to do?");
 System.out.println("a. Know my balance");
 System.out.println("b. Know my validity date");
 System.out.println("c. Know number of free calls available");
 System.out.println("d. More");
 System.out.println("1. Prepaid Bill Request");
 System.out.println("2. Customer Preferences");
 System.out.println("3. GPRS activation");
 System.out.println("4. Special Message Offers");
 System.out.println("5. Special GPRS Offers");
 System.out.println("q. Exit");
 System.out.print("Enter your choice: ");
 String choice = scanner.nextLine().trim().toLowerCase();
 switch (choice) {
 case "a":
 System.out.println("Your current balance is ₹123.50");
 break;
 case "b":
 System.out.println("Your validity is up to: 30-Sep-2025");
 break;
 case "c":
 System.out.println("You have 38 free calls remaining this month.");
 break;
 case "d":
 showMoreMenu(scanner);
 break;
 case "1":
 System.out.println("Prepaid Bill Request has been received. You will get an SMS shortly.");
 break;
 case "2":
 System.out.println("Opening Customer Preferences...");
 break;
 case "3":
 System.out.println("GPRS activation successful.");
 break;
 case "4":
 System.out.println("Special message offers include 100 SMS/day at ₹1.");
 break;
 case "5":
 System.out.println("Special GPRS offers: 1GB/day for ₹49/week.");
 break;
 case "q":
 System.out.println("Thank you for using Powered Air Services. Goodbye!");
 exitMain = true;
 break;
 default:
 System.out.println("Invalid input. Please try again.");
 }
 }
 scanner.close();
 }
 public static void showMoreMenu(Scanner scanner) {
 boolean inMoreMenu = true;
 while (inMoreMenu) {
 System.out.println("\n--- More Options ---");
 System.out.println("6. Check Device Compatibility");
 System.out.println("7. Go back to Previous Menu");
 System.out.println("q. Exit");
 System.out.print("Enter your choice: ");
 String moreChoice = scanner.nextLine().trim().toLowerCase();
 switch (moreChoice) {
 case "6":
 System.out.println("Your device is compatible with our 4G and 5G networks.");
 break;
 case "7":
 inMoreMenu = false; // Go back to previous menu
 break;
 case "q":
 System.out.println("Thank you for using Powered Air Services. Goodbye!");
 System.exit(0); // Exit the program
 break;
 default:
 System.out.println("Invalid input. Please try again.");
 }
 }
 }
}
