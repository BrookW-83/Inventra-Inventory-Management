using Microsoft.EntityFrameworkCore;
using InventoryManagement.Domain.Entities;

namespace InventoryManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<InventoryItem> InventoryItems { get; set; }
    public DbSet<Purchase> Purchases { get; set; }
    public DbSet<PurchaseItem> PurchaseItems { get; set; }
    public DbSet<InventoryLog> InventoryLogs { get; set; }
    public DbSet<Profile> Profiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<InventoryItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.PurchasedBy).IsRequired().HasMaxLength(200);
            entity.Property(e => e.TotalCost).HasPrecision(18, 2);
            entity.HasMany(e => e.PurchaseItems)
                .WithOne(e => e.Purchase)
                .HasForeignKey(e => e.PurchaseId)
                .OnDelete(DeleteBehavior.Cascade);

            // Stripe Payment Fields
            entity.Property(e => e.StripeSessionId).HasMaxLength(255);
            entity.Property(e => e.StripePaymentIntentId).HasMaxLength(255);
            entity.Property(e => e.PaymentStatus).HasConversion<int>();
        });

        modelBuilder.Entity<PurchaseItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.TotalPrice).HasPrecision(18, 2);
            entity.Property(e => e.ItemName).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Section).HasConversion<int>();
            entity.Property(e => e.AddedToInventory).HasDefaultValue(false);
            entity.HasOne(e => e.InventoryItem)
                .WithMany()
                .HasForeignKey(e => e.InventoryItemId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InventoryLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PerformedBy).IsRequired().HasMaxLength(200);
            entity.HasOne(e => e.InventoryItem)
                .WithMany()
                .HasForeignKey(e => e.InventoryItemId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Profile>(entity =>
        {
            entity.ToTable("profiles");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasColumnType("uuid");
            entity.Property(e => e.Name)
                .IsRequired()
                .HasColumnName("name")
                .HasMaxLength(200);
            entity.Property(e => e.Role)
                .IsRequired()
                .HasColumnName("role")
                .HasMaxLength(20)
                .HasDefaultValue("user");
            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at")
                .HasColumnType("timestamp with time zone");
            entity.Property(e => e.UpdatedAt)
                .HasColumnName("updated_at")
                .HasColumnType("timestamp with time zone");

            // Basic Info
            entity.Property(e => e.Description)
                .HasColumnName("description")
                .HasMaxLength(1000);
            entity.Property(e => e.ContactEmail)
                .HasColumnName("contact_email")
                .HasMaxLength(255);

            // Extended Info
            entity.Property(e => e.Phone)
                .HasColumnName("phone")
                .HasMaxLength(50);
            entity.Property(e => e.Address)
                .HasColumnName("address")
                .HasMaxLength(500);
            entity.Property(e => e.Website)
                .HasColumnName("website")
                .HasMaxLength(255);
            entity.Property(e => e.Industry)
                .HasColumnName("industry")
                .HasMaxLength(100);

            // Comprehensive Info
            entity.Property(e => e.LogoUrl)
                .HasColumnName("logo_url")
                .HasMaxLength(500);
            entity.Property(e => e.LinkedInUrl)
                .HasColumnName("linkedin_url")
                .HasMaxLength(255);
            entity.Property(e => e.TwitterUrl)
                .HasColumnName("twitter_url")
                .HasMaxLength(255);
            entity.Property(e => e.FacebookUrl)
                .HasColumnName("facebook_url")
                .HasMaxLength(255);
            entity.Property(e => e.BusinessHours)
                .HasColumnName("business_hours")
                .HasMaxLength(200);
            entity.Property(e => e.CompanySize)
                .HasColumnName("company_size")
                .HasMaxLength(50);
        });
    }
}
