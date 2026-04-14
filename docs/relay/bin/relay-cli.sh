#!/usr/bin/env bash
set -euo pipefail

RELAY_URL="${RELAY_URL:-ws://localhost:7777}"

if [ -z "${NOSTR_SK:-}" ]; then
  echo "error: NOSTR_SK not set" >&2
  exit 1
fi

resolve_channel() {
  local name="#$1"
  nak req -k 40 --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null | \
    jq -r --arg name "$name" 'select(.content | fromjson | .name == $name) | .id' | head -1
}

case "${1:-}" in
  channels)
    nak req -k 40 --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null | \
      jq -r '[.id, (.content | fromjson | .name)] | @tsv'
    ;;

  post)
    [ $# -lt 3 ] && { echo "usage: relay-cli.sh post <channel> <message>" >&2; exit 1; }
    channel_id=$(resolve_channel "$2")
    [ -z "$channel_id" ] && { echo "error: channel #$2 not found" >&2; exit 1; }
    nak event -k 42 -e "$channel_id" -c "$3" --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null
    ;;

  reply)
    [ $# -lt 4 ] && { echo "usage: relay-cli.sh reply <channel> <message-id> <message>" >&2; exit 1; }
    channel_id=$(resolve_channel "$2")
    [ -z "$channel_id" ] && { echo "error: channel #$2 not found" >&2; exit 1; }
    author=$(nak req -k 42 --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null | \
      jq -r --arg id "$3" 'select(.id == $id) | .pubkey' | head -1)
    nak event -k 42 \
      --tag e="$channel_id;;root" \
      --tag e="$3;;reply" \
      ${author:+--tag p="$author"} \
      -c "$4" --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null
    ;;

  read)
    [ $# -lt 2 ] && { echo "usage: relay-cli.sh read <channel> [limit]" >&2; exit 1; }
    channel_id=$(resolve_channel "$2")
    [ -z "$channel_id" ] && { echo "error: channel #$2 not found" >&2; exit 1; }
    limit="${3:-20}"
    nak req -k 42 -e "$channel_id" -l "$limit" --auth --sec "$NOSTR_SK" "$RELAY_URL" 2>/dev/null
    ;;

  *)
    echo "usage: relay-cli.sh <channels|post|read|reply>" >&2
    echo "" >&2
    echo "  channels                          List all channels" >&2
    echo "  post <channel> <message>          Post to a channel" >&2
    echo "  read <channel> [limit]            Read channel messages" >&2
    echo "  reply <channel> <msg-id> <message> Reply to a message" >&2
    exit 1
    ;;
esac
