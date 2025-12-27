# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["InventoryManagement.API/InventoryManagement.API.csproj", "InventoryManagement.API/"]
COPY ["InventoryManagement.Application/InventoryManagement.Application.csproj", "InventoryManagement.Application/"]
COPY ["InventoryManagement.Domain/InventoryManagement.Domain.csproj", "InventoryManagement.Domain/"]
COPY ["InventoryManagement.Infrastructure/InventoryManagement.Infrastructure.csproj", "InventoryManagement.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "InventoryManagement.API/InventoryManagement.API.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/InventoryManagement.API"
RUN dotnet build "InventoryManagement.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "InventoryManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Copy published application
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "InventoryManagement.API.dll"]
