import java.util.StringTokenizer;
import java.util.Scanner;
public class IntegerSumTokenizer {
 public static void main(String[] args) {
 Scanner scanner = new Scanner(System.in);
 System.out.println("Enter a line of integers (separated by space):");
 String inputLine = scanner.nextLine();
 StringTokenizer tokenizer = new StringTokenizer(inputLine);
 int sum = 0;
 System.out.println("You entered the integers:");
 while (tokenizer.hasMoreTokens()) {
 String token = tokenizer.nextToken();
 int num = Integer.parseInt(token);
 System.out.println(num);
 sum += num;
 }
 System.out.println("Sum of all integers: " + sum);
 scanner.close();
 }
}