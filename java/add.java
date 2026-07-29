import java.util.Scanner;
class add
{
void sum(int a, int b)
{
System.out.println("Sum="+(a+b));
}
public static void main(String args[])
{
int x,y;
Scanner sc = new Scanner(System.in);
System.out.print("Enter x value:");
x=sc.nextInt();
System.out.print("Enter y value:");
y=sc.nextInt();
add S1=new add();
S1.sum(x,y);
}
}
