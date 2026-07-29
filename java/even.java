import java.util.*;
class even
{
public static void main(String args[])
{
Scanner sc = new Scanner(System.in);
System.out.print("Enter array values:");
int n=sc.nextInt();
int a[]= new int[n];
for (int i = 0; i < n; i++)
{
a[i] = sc.nextInt();
}
int even=0,odd=0;
for(int i=0;i<a.length;i++)
{
if(a[i]%2==0){
even++;
}
else
{
odd++;
System.out.print("Even numbers="+even+"\t"+"Odd numbers="+odd);
}
}
}
}
