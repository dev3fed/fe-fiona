FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY Cuba/*.csproj ./Cuba/
WORKDIR /app/Cuba
RUN dotnet restore --verbosity minimal

WORKDIR /app
COPY . ./

WORKDIR /app/Cuba
RUN if [ -f "package.json" ]; then \
        npm ci --production --silent; \
    fi

RUN dotnet publish -c Release -o out \
    --no-restore \
    --verbosity minimal \
    -p:PublishTrimmed=false \
    -p:PublishReadyToRun=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/Cuba/out .

COPY --from=build /app/Cuba/appsettings.Development.json ./appsettings.Development.json

EXPOSE 5475
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:5475
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV ASPNETCORE_LOGGING__CONSOLE__DISABLECOLORS=false

ENTRYPOINT ["dotnet", "Cuba.dll"]
