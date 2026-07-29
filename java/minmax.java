class minmax
{
public static void main(String args[])
{
int a[]={100,210,21,213,311,213};
int min=a[0],max=a[0];
for(int i=0;i<a.length;i++)
{
if(min<a[i])
min=a[i];
}
for(int i=0;i<a.length;i++)
{
if(max>a[i])
max=a[i];
}
System.out.println("Smallest="+min+"\t"+"Largest="+max);
}
}
